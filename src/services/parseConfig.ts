import Parse from "parse/react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Inicializa o armazenamento local
Parse.setAsyncStorage(AsyncStorage);

// Substitua pelas suas chaves do painel do Back4App
Parse.initialize("LPW7OOa7HtpzkYcXFE7Y0cbV2x6CF8KrcEkPyafz", "DBDMcOz91gGg1OAXX21aEiGqMuSm55gfaPzq5n8o");
Parse.serverURL = 'https://parseapi.back4app.com/';

export default Parse;