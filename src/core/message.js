export default class Message{
    constructor(){

    }

    static TYPE_LOGIN = 'login';
    static TYPE_MESSAGE = 'message';
    // static TYPE_START_MATCH = 'start match';
    static TYPE_WAIT_MATCH = 'wait match';
    static TYPE_END_MATCH = 'end match';
    // static TYPE_EXIT_MATCH = 'exit match';

    static TYPE_QUIT = 'quit';
    static TYPE_PING = 'ping';

    static TYPE_LIST_ID = 'list id';
    static TYPE_CHOOSE_ANSWER = 'choose answer';

    static TYPE_USE_AI = 'use ai';

    static TYPE_CONNECT = 'connect';
    static TYPE_DISCONNECT = 'disconnect';

}