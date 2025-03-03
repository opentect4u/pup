export type AppStoreContext = {
    isLogin: boolean
    isLoading: boolean
    handleLogin: (loginText: string, passwordText: string) => Promise<void>
    handleLogout: () => Promise<void>
}
