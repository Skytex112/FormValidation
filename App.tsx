import { StatusBar } from "expo-status-bar";
import { SQLiteProvider } from "expo-sqlite";
import { RegistartionScreen } from "./src/screens/RegistretionScreen";
import { migrateDbIfNeeded } from "./src/database/database";

export default function App() {
  return (
    <SQLiteProvider
      databaseName="registration.db"
      onInit={migrateDbIfNeeded}
    >
      <RegistartionScreen />
      <StatusBar style="auto" />
    </SQLiteProvider>
  );
}