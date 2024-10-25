Forudsætning for test af NFC funktionaliteten
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
	Kør npm install i projectets root 

2. Android-opsætning

	2.1 Konfigurer Miljøvariabler for Andriod SDK

		Sørg for, at ANDROID_HOME er konfigureret i dine miljøvariabler for systemet.

		Mac/Linux
			export ANDROID_HOME=$HOME/Library/Android/sdk
			export PATH=$PATH:$ANDROID_HOME/emulator
			export PATH=$PATH:$ANDROID_HOME/tools
			export PATH=$PATH:$ANDROID_HOME/tools/bin
			export PATH=$PATH:$ANDROID_HOME/platform-tools

		Windows
			Tilføj Android SDK-stien til Miljøvariabler. Stien bør være ligende:
			C:\Users\<Din-Brugernavn>\AppData\Local\Android\Sdk
	
	2.2 Link React Native-afhængigheder

		Hvis du ikke bruger Expo, kan det være nødvendigt at linke afhængigheder. Kør: npx react-native link

3. Start Metro Bundleren

	start Metro bundleren i projekets root directory, kør: npx react-native start
	
4. Kørsel af projekt

	4.1 Kørsel på emulator i Andriod Studio - Understøtter ikke NFC funktionallitet resten af appen vil stadig virke men NFC tags kan ikke scannes
	
		Opret et virtuel device under device manager
			Følgende specs for det virtuel device er testet virker:
					Category: Phone
					Name: Pixel 3
					System image: R -> API: 30, ABI: x86 og Target: Andriod 11.0 (Google Play)
		
		Tjek at Emulatoren er fundet ved at køre "adb devices" i terminalen
		
		Kør projektet ved at køre: npx react-native run-android
		
	4.2 Tilslut fysisk Andriod enhed - Hvis enheden besidder NFC hardware og det er slået til kan NFC funktionalitet anvendes
	
		Sørg for, at Developer Mode og USB Debugging er aktiveret på din Android-enhed.
		
		Download .apk fil fra github på andriod enheden (i indstillinger tillad at installere ukendte apps fra det sted filen hentes fra fx Gmail)
		
		Tilslut din Android-enhed via USB.
		
		Tjek at enhenden er fundet ved at køre "adb devices" i terminalen
		
		For kørsel af projektet kør: npx expo start --dev-client
		
		Åben appen på andriod enheden.


