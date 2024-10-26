import React, { useState, useCallback } from "react";
import { Text, ScrollView, View } from "react-native";
import { PieChart, ContributionGraph } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { useFocusEffect } from "@react-navigation/native";
import { getDatabase, ref, onValue } from "firebase/database";
import moment from "moment";

export default function DashboardScreen() {
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [partialCount, setPartialCount] = useState(0);
  const [contributions, setContributions] = useState([]); // Array for ContributionGraph
  const [selectedDay, setSelectedDay] = useState(null); // State to store pressed day data

  useFocusEffect(
    useCallback(() => {
      const db = getDatabase();
      const registrationRef = ref(db, "registrations/");

      const unsubscribe = onValue(registrationRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const registrationArray = Object.values(data);

          let active = 0;
          let inactive = 0;
          let partial = 0;
          const dateCounts = {}; // To store count of registrations by date

          registrationArray.forEach((reg) => {
            if (
              reg.currentWashCount < reg.MaxWashCount &&
              reg.currentWashCount !== 0
            ) {
              partial += 1;
            } else if (reg.Status === "Active") {
              active += 1;
            } else if (reg.Status === "Inactive") {
              inactive += 1;
            }

            // Process createDate for ContributionGraph
            const date = moment(reg.createDate).format("YYYY-MM-DD");
            dateCounts[date] = (dateCounts[date] || 0) + 1;
          });

          setActiveCount(active);
          setInactiveCount(inactive);
          setPartialCount(partial);

          // Transform dateCounts into the format required by ContributionGraph
          const contributionData = Object.keys(dateCounts).map((date) => ({
            date,
            count: dateCounts[date],
          }));

          setContributions(contributionData);
        }
      });

      return () => unsubscribe(); // Cleanup on unmount
    }, [])
  );

  const chartData = [
    {
      name: "Active",
      population: activeCount,
      color: "rgba(58, 209, 78, 1)", // Green color for Active
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Inactive",
      population: inactiveCount,
      color: "rgba(216, 15, 15, 1)", // Red color for Inactive
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Partial Use",
      population: partialCount,
      color: "rgba(255, 206, 86, 1)", // Yellow color for Partial Use
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={[globalStyles.scrollContainer, { paddingTop: 60 }]}
    >
      <Text style={globalStyles.titleText}>Status of registred items</Text>

      <PieChart
        data={chartData}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#1E2923",
          backgroundGradientTo: "#08130D",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          strokeWidth: 2,
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />

      <Text style={globalStyles.titleText}>Overview of registrations</Text>

      <ContributionGraph
        values={contributions}
        endDate={new Date()}
        numDays={90} // Adjust to show the desired range of dates
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`, // Green color for cells
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          strokeWidth: 2,
        }}
        backgroundColor={"#ffffff"} // White background behind cells
        onDayPress={(value) => {
          if (value?.date) {
            // Format date as a string
            const formattedDate = moment(value.date).format("YYYY-MM-DD");
            // Set the pressed day with count defaulting to 0 if undefined
            setSelectedDay({
              date: formattedDate, // Ensure date is a string
              count: value.count ?? 0,
            });
          }
        }}
      />

      {/* Conditionally render selected day's data */}
      {selectedDay && (
        <View
          style={{
            marginTop: 10,
            padding: 10,
            backgroundColor: "#f0f0f0",
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Date: {selectedDay.date}
          </Text>
          <Text>Registrations made {selectedDay.count}</Text>
        </View>
      )}
    </ScrollView>
  );
}
