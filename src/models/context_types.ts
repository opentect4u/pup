export type AppStoreContext = {
  isLogin: boolean;
  isLoading: boolean;
  handleLogin: (loginText: string, passwordText: string, loginType: string) => Promise<void>;
  handleLogout: () => Promise<void>;
};
