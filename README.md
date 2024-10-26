-- Til programmeringen af produktet er github copilot anvendt --

Forudsætning for test af NFC funktionaliteten.
	Da implementationen af NFC tekonolgi ikke kan køres på Expo Go kræver kørsel af opgaven potientielt en del opsætning, har lavet en guide nedenfor.
 	 Der er dog 1 krav, hvis scanning af NFC tags skal testes
    		1) du har et tomt NFC tag liggende 
    		2) du har en andriod device du er villig til at smide i developer mode og downloade en questionable app 


Instalation af nødvendigt software
	Node.js: Sørg for, at Node.js er installeret
	Android Studio: Installer Android Studio, inklusive Android SDK og emulator.
	Opsæt Android SDK og emulator, hvis du ønsker at køre projektet på en emulator.
	Alternativt kan en fysisk Android-enhed bruges til test.
	Java Development Kit (JDK) (SKAL VÆRE V 17 / 17.12 da Gardle kræver en LTS version og 17 er den nyeste LTS version).

Installationsvejledning


1. Installer Afhængigheder
   	Kør npm install for at oprette node modules

		npm install

3. Android-opsætning

	2.1 Konfigurer Miljøvariabler for Andriod SDK - MAC/Linux
		Sørg for, at ANDROID_HOME er konfigureret i dine miljøvariabler for systemet.
			
				export ANDROID_HOME=$HOME/Library/Android/sdk
				export PATH=$PATH:$ANDROID_HOME/emulator
				export PATH=$PATH:$ANDROID_HOME/tools
				export PATH=$PATH:$ANDROID_HOME/tools/bin
				export PATH=$PATH:$ANDROID_HOME/platform-tools
   
   	2.2 Konfigurer Miljøvariabler for Andriod SDK - Windows
		Sørg for, at ANDROID_HOME er konfigureret i dine miljøvariabler for systemet.
			Windows
				Tilføj Android SDK-stien til Miljøvariabler. Stien bør være ligende:
				C:\Users\<Din-Brugernavn>\AppData\Local\Android\Sdk
	
	2.3 Link React Native-afhængigheder
		Hvis du ikke bruger Expo, kan det være nødvendigt at linke afhængigheder kør:

   			npx react-native link

5. Start Metro Bundleren
	start Metro bundleren i projekets root directory, kør:

		npx react-native start
	
7. Kørsel af projekt

	4.1 Kørsel på emulator i Andriod Studio - Understøtter ikke NFC funktionallitet resten af appen vil stadig virke men NFC tags kan ikke scannes
		Opret et virtuel device under device manager
			Følgende specs for det virtuel device er testet virker:
					Category: Phone
					Name: Pixel 3
					System image: R -> API: 30, ABI: x86 og Target: Andriod 11.0 (Google Play)
   
   	4.1.1 Tjek at Emulatoren er fundet ved at køre "adb devices" i terminalen

   		adb devices

	4.1.2	Kør projektet på emulatoren

				npx react-native run-android
		
	4.2 Tilslut fysisk Andriod enhed - Hvis enheden besidder NFC hardware og det er slået til kan NFC funktionalitet anvendes

	4.2.1 Sørg for, at Developer Mode og USB Debugging er aktiveret på din Android-enhed.
		
	4.2.2 Download .apk fil fra github på andriod enheden (i indstillinger tillad at installere ukendte apps fra det sted filen hentes fra fx Gmail)
		
   	4.2.3 Tilslut din Android-enhed via USB.
		
	4.2.4 Tjek at enhenden er fundet ved at køre "adb devices" i terminalen
		
	4.2.5 For kørsel af projektet

   		npx expo start --dev-client
		
	4.2.6 Åben appen på andriod enheden.


