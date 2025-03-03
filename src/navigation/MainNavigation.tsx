import React, { useContext } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/LoginScreen"
import navigationRoutes from "../routes/routes"
import { NavigationContainer } from "@react-navigation/native"
import BottomNavigationPaper from "./BottomNavigationPaper"
// import NoInternetScreen from "../screens/NoInternetScreen"
import { useNetInfo } from "@react-native-community/netinfo"
import { AppStore } from "../context/AppContext"

export default function MainNavigation() {
    const Stack = createNativeStackNavigator()
    const { isConnected } = useNetInfo()
    console.log("NET INFOOOOOOO", isConnected)

    const { isLogin } = useContext<any>(AppStore)

    return (
        <>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{ headerShown: false, animation: "simple_push" }}>
                    {isLogin ? (
                        <>
                            <Stack.Screen
                                name={navigationRoutes.bottomNavigationPaper}
                                component={BottomNavigationPaper}
                            />
                        </>
                    ) : (
                        <>
                            <Stack.Screen
                                name={navigationRoutes.loginScreen}
                                component={LoginScreen}
                            />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}