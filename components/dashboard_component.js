import React, { useState, useCallback, useEffect } from "react";
import { Text, View, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { PieChart, ContributionGraph } from "react-native-chart-kit"; // Used for charts
import { globalStyles } from "../styles/globalStyles";
import { useFocusEffect } from "@react-navigation/native"; // like useEffect but only runs when screen is focused
import { getDatabase, ref, onValue } from "firebase/database";
import moment from "moment"; // used for date formatting
import { getAuth } from "firebase/auth";
import { LogOut } from "../components/log_out_component"; 
import { useNavigation } from "@react-navigation/native";

export const Dashboard = () => {
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [partialCount, setPartialCount] = useState(0);
  const [contributions, setContributions] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const navigation = useNavigation();

  const auth = getAuth();

  useFocusEffect(
    useCallback(() => {
      // Define the database reference
      const db = getDatabase();
      const registrationRef = ref(db, "registrations/");

      // Get data from DB when updated
      const unsubscribe = onValue(registrationRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const registrationArray = Object.values(data);

          // Counters for the different statuses
          let active = 0;
          let inactive = 0;
          let partial = 0;

          // Used to store counts in object
          const dateCounts = {};

          // Get the current user and company
          const currentUser = auth.currentUser;
          const userCompany = currentUser ? currentUser.company : "Unknown";

          // Loop through registrations and increment counters
          registrationArray.forEach((reg) => {
            if (
              reg.currentWashCount < reg.MaxWashCount &&
              reg.currentWashCount !== 0 &&
              reg.Owner === userCompany
            ) {
              partial += 1;
            } else if (reg.Status === "Active") {
              active += 1;
            } else if (reg.Status === "Inactive") {
              inactive += 1;
            }

            // Create the "create date" for each element in object, so it can be used in contribution map
            const date = moment(reg.createDate).format("YYYY-MM-DD");
            dateCounts[date] = (dateCounts[date] || 0) + 1;
          });

          // Set the state of the counters
          setActiveCount(active);
          setInactiveCount(inactive);
          setPartialCount(partial);

          // Format to needed date format for contribution map
          const contributionData = Object.keys(dateCounts).map((date) => ({
            date,
            count: dateCounts[date],
          }));

          setContributions(contributionData);
        }
      });

      return () => unsubscribe();
    }, [])
  );

  useEffect(() => {
    if (selectedDay) {
      const timer = setTimeout(() => {
        setSelectedDay(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedDay]);

  // Data for the pie chart
  const chartData = [
    {
      name: "Active",
      population: activeCount,
      color: "rgba(58, 209, 78, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Inactive",
      population: inactiveCount,
      color: "rgba(216, 15, 15, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Partial Use",
      population: partialCount,
      color: "rgba(255, 206, 86, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <ScrollView>
      <View style={globalStyles.dashboardChart}>
        <Text style={globalStyles.titleText}>Status of registered items</Text>
        <PieChart
          data={chartData}
          width={Dimensions.get("window").width - 100} // Adjusted width to make it smaller
          height={180} // Adjusted height to make it smaller
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
            strokeWidth: 2,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      </View>

      <View style={globalStyles.dashboardChart}>
        <Text style={globalStyles.titleText}>Overview of registrations</Text>
        <ContributionGraph
          values={contributions}
          endDate={new Date()}
          numDays={90}
          width={Dimensions.get("window").width - 80} // Adjusted width
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 2,
          }}
          backgroundColor={"#ffffff"}
          style={{ alignSelf: "center" }} // Center the ContributionGraph
          // Used to display number of registrations on press of the given day
          onDayPress={(value) => {
            if (value?.date) {
              const formattedDate = moment(value.date).format("YYYY-MM-DD");
              setSelectedDay({
                date: formattedDate,
                count: value.count ?? 0,
              });
            }
          }}
        />
      </View>

      {selectedDay && (
        <View
          style={[globalStyles.dashboardChart, { backgroundColor: "#f9f9f9" }]}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Date: {selectedDay.date}
          </Text>
          <Text>Registrations made: {selectedDay.count}</Text>
        </View>
      )}

      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={[globalStyles.logoutTouchable]}
          onPress={() => LogOut(navigation)}
        >
          <Text style={globalStyles.touchableText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
