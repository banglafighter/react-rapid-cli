import {RapidAppConfig} from "react-rapid-app";

export default class AppConfig extends RapidAppConfig {

    public staticURL: string = process.env["STATIC_URL"] || "http://127.0.0.1:1300/";

    public getBaseURL(): string {
        return process.env["BASE_URL"] || "http://127.0.0.1:1300/";
    }

}