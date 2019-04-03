import { $, $$, ElementFinder, ElementArrayFinder, browser } from "protractor";
import { Actions } from "../../support/actions";
import { BrowserActions } from "../../support/browser";
import { logger } from "../../support/logger";
import { CustomWait } from "../../support/wait";

export class MagentoAdminLogin {
    private url: string = "index.php/admin/admin/";
    private usernameInput: ElementFinder;
    private passwordInput: ElementFinder;
    private signInButton: ElementFinder;
    private messageError: ElementFinder;

    constructor() {
        this.usernameInput = $("#username");
        this.passwordInput = $("#login");
        this.signInButton = $("button.action-login.action-primary");
        this.messageError = $("div.message.message-error.error");
    }

    public async navigateTo() {
        await BrowserActions.get(this.url);
    }

    public async logIn(username: string, password: string) {
        await this.navigateTo();
        let url = await browser.getCurrentUrl();
        await CustomWait.waitForLoad(CustomWait.timeouts.tiny);
        if (!url.includes("dashboard")) {
            await CustomWait.waitForElementToBeClickable(this.signInButton);
            await Actions.sendKeys(this.usernameInput, username);
            await Actions.sendKeys(this.passwordInput, password);
            await Actions.click(this.signInButton);
        }
    }

    public async getErrorMessage() {
        let text = await this.messageError.getText();
        logger.debug("Text: " + text);
        return text;
    }

    public async isErrorMessageVisible() {
        return await this.messageError.isPresent();
    }
}
