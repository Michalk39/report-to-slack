import { BrowserActions } from "../../support/browser";
import { ElementFinder, $, ElementArrayFinder, $$ } from "protractor";
import { Actions } from "../../support/actions";




export class MagentoContentPagesAddNewPage {
    private saveButton: ElementFinder;
    private pageTitleField: ElementFinder;


    constructor() {
        this.saveButton = $("save-button");
        this.pageTitleField = $("input[name='title']");
    }

    async fillPageTitleField(title: string) {
        Actions.sendKeys(this.pageTitleField, title);
    }

    async clickSaveButton() {
        Actions.click(this.saveButton);
    }

}