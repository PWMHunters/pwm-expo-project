import Parse from "parse/react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

Parse.setAsyncStorage(AsyncStorage);

Parse.initialize("LPW7OOa7HtpzkYcXFE7Y0cbV2x6CF8KrcEkPyafz", "DBDMcOz91gGg1OAXX21aEiGqMuSm55gfaPzq5n8o");
Parse.serverURL = 'https://parseapi.back4app.com/';

export default Parse;