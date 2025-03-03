import React from 'react'
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { usePaperColorScheme } from "../theme/theme"
import HomeNavigation from "./HomeNavigation"
import SettingsNavigation from "./SettingsNavigation"
import navigationRoutes from '../routes/routes'

const Tab = createMaterialBottomTabNavigator()

function BottomNavigationPaper() {
    const theme = usePaperColorScheme()

    return (
        <Tab.Navigator
            theme={theme}
            initialRouteName={navigationRoutes.homeNavigation}
            activeColor={theme.colors.primary}
            inactiveColor={theme.colors.onSurface}
            barStyle={{
                backgroundColor: theme.colors.surface,
                borderTopWidth: 0.4,
                borderColor: theme.colors.secondaryContainer,
                display: "flex"
            }}
            shifting
            compact
        >
            <Tab.Screen
                name={navigationRoutes.homeNavigation}
                component={HomeNavigation}
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, focused }: any) =>
                        !focused ? (
                            <MaterialCommunityIcons
                                name="home-outline"
                                color={color}
                                size={26}
                            />
                        ) : (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                }}
            />
            <Tab.Screen
                name={navigationRoutes.settingsNavigation}
                component={SettingsNavigation}
                options={{
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ color, focused }: any) =>
                        !focused ? (
                            <MaterialCommunityIcons
                                name="cog-outline"
                                color={color}
                                size={26}
                            />
                        ) : (
                            <MaterialCommunityIcons name="cog" color={color} size={26} />
                        ),
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomNavigationPaper
