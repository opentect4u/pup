import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import SettingsScreen from '../screens/Settings/SettingsScreen'
import SavedProjectsScreen from '../screens/Settings/SavedProjectsScreen'

export default function SettingsNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navigationRoutes.settingsScreen} component={SettingsScreen} />
            <Stack.Screen name={navigationRoutes.savedProjectsScreen} component={SavedProjectsScreen} />
        </Stack.Navigator>
    )
}