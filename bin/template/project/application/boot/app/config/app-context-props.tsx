import {_t, RapidUtil, RapidAppContextProps, RapidMessageData} from "react-rapid-app";


export default class AppContextProps implements RapidAppContextProps {
    isShowLoader: boolean = false
    isShowFlashMessage: boolean = false
    messageData: RapidMessageData = RapidMessageData.failed("Unexpected Error!");
}