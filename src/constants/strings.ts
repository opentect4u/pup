class GlobalTemplateStrings {
  protected globalStrings = {
    welcome: `Welcome back,`,
    welcomeSubText: `User ID:`,
    fontName: `Product Sans Regular`,
    yesTxt: 'YES',
    noTxt: 'NO',
    submitText: 'SUBMIT',
    saveText: `Save`,
    dateText: `Choose Date`,
  };
  public getStrings() {
    return this.globalStrings;
  }
}

class LoginScreenTemplateStrings extends GlobalTemplateStrings {
  private loginScreenStrings = {
    login: 'Login',
    loginSubText: 'Please Sign In to continue.',
    buttonText: 'Sign In',
  };
  public getStrings() {
    return {
      ...this.globalStrings,
      ...this.loginScreenStrings,
    };
  }
}

class HomeScreenTemplateStrings extends GlobalTemplateStrings {
  private homeScreenStrings = {
    projectDropdownLabel: `Choose Desired Project`,
    uploadPhotoBtnLabel: `Upload Photo(s)`,
    uploadPhotoBtnSubText: `Maximum 4 Photos. (Each 2MB max)`,
    fontItalic: `Product Sans Italic`,
    fetchProgress: `Fetch Progress`,
    complete: `Completed`,
    current_prg: `Current Progress`,
    finalSubmissionDate: `Final Submission Date`,
  };
  public getStrings() {
    return {
      ...this.globalStrings,
      ...this.homeScreenStrings,
    };
  }
}

class SettingsScreenTemplateStrings extends GlobalTemplateStrings {
  private settingsScreenStrings = {
    logOutText: `Log Out`,
    logOutAlertText: `Are you sure you want to log out?`,
  };
  public getStrings() {
    return {
      ...this.globalStrings,
      ...this.settingsScreenStrings,
    };
  }
}

export const globalStrings = new GlobalTemplateStrings();
export const loginScreenStrings = new LoginScreenTemplateStrings();
export const homeScreenStrings = new HomeScreenTemplateStrings();
export const settingsScreenStrings = new SettingsScreenTemplateStrings();
