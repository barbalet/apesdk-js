
/****************************************************************

 console.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var local_commands = 0;
var command_line_execution;
var command_line_external_exit = 0;

function io_command_line_execution_set() {
var _tmp = 0;
    command_line_execution = 1;
}

function io_command_line_execution() {
var _tmp = 0;
    return command_line_execution;
}

function io_entry_execution(argc, argv) {
var _tmp = 0;
    if ( argv )
    {
        if ( ( argc == 2 ) && ( argv[1][1] == 'c' ) )
        {
            io_command_line_execution_set();
        }
    }
}

function io_help_line(specific, output_function) {
var _tmp = 0;
var string_line = [0];
    io_three_string_combination( string_line, specific.command, specific.addition, specific.help_information, 28 );
    output_function( string_line );
}

function io_help(ptr, response, output_function) {
var _tmp = 0;
var loop = 0;
var response_len = 0;
var found = 0;

    if ( response != 0 )
    {
        response_len = io_length( response, 1024 );
    }

    if ( response_len == 0 )
    {
        output_function( "Commands:" );
    }

    do
    {
        if ( local_commands[loop].function_ != 0 )
        {
            if ( ( local_commands[loop].help_information ) && ( local_commands[loop].help_information[0] != 0 ) )
            {
                if ( response_len == 0 )
                {
                    io_help_line( local_commands[loop], output_function );
                }
                else
                {
var command_len = io_length( local_commands[loop].command, 1024 );
var count = io_find( response, 0, response_len, local_commands[loop].command, command_len );
                    if ( count == command_len )
                    {
                        io_help_line( local_commands[loop], output_function );
                        found = 1;
                    }
                }
            }
            loop++;
        }
    }
    while ( local_commands[loop].function_ != 0 );
    if ( ( response_len != 0 ) && ( found == 0 ) )
    {
        SHOW_ERROR( "Command not found, type help for more information" );
    }
    return 0;
}

function io_quit(ptr, response, output_function) {
var _tmp = 0;
    return 1;
}

function io_console_entry_clean(string, length) {
var _tmp = 0;
    return fgets( string, length, stdin );
}

function io_console_entry(string, length) {
var _tmp = 0;
    return io_console_entry_clean( string, length );
}

function io_console_out(value) {
var _tmp = 0;
    printf( "%s\n", value );
    fflush( stdout );
}

function io_console_quit() {
var _tmp = 0;
    command_line_external_exit = 1;
}

function io_console(ptr, commands, input_function, output_function) {
var _tmp = 0;
    var buffer = memory_new( STRING_BLOCK_SIZE || 4096 );

    local_commands = commands;

    if ( ( input_function )( buffer, STRING_BLOCK_SIZE ) != 0 )
    {
var loop = 0;
var buffer_len = io_length( buffer, STRING_BLOCK_SIZE );

        if ( ( commands[0].command == 0 ) && ( commands[0].function_ == 0 ) )
        {
            return SHOW_ERROR( "No commands provided" );
        }

        
        if ( IS_RETURN( buffer[buffer_len - 1] ) )
        {
            buffer[buffer_len - 1] = 0;
            buffer_len--;
        }
        if ( IS_RETURN( buffer[buffer_len - 1] ) )
        {
            buffer[buffer_len - 1] = 0;
            buffer_len--;
        }

        if ( buffer_len != 0 )
        {
            do
            {
var command_len = io_length( commands[loop].command, 1024 );
var count = io_find( buffer, 0, buffer_len, commands[loop].command, command_len );
                if ( count != -1 )
                {
                    var return_value;
var function_ = commands[loop].function_;
                    if ( IS_SPACE( buffer[count] ) )
                    {
                        var argument = buffer.slice( count + 1 );
                        return_value = function_( ptr, argument, output_function );
                        if ( command_line_external_exit )
                        {
                            return 1;
                        }
                        return return_value;
                    }
                    else if ( buffer[count] == 0 )
                    {
                        return_value = function_( ptr, 0, output_function );
                        if ( command_line_external_exit )
                        {
                            return 1;
                        }
                        return return_value;
                    }
                }
                loop++;
            }
            while ( ( commands[loop].command != 0 ) && ( commands[loop].function_ != 0 ) );

            SHOW_ERROR( "Command not found, type help for more information" );

            return 0;
        }
        else
        {
            return 0;
        }
    }
    return SHOW_ERROR( "Console failure" );
}

function mygetch() {
var _tmp = 0;
    var ch;
    var error;
    var Otty, Ntty;

    fflush(stdout);
    tcgetattr(0, Otty);
    Ntty = Otty;

    Ntty.c_iflag  =  0;     
    Ntty.c_oflag  =  0;     
    Ntty.c_lflag &= ~ICANON;    


    
    Ntty.c_lflag &= ~ECHO;  

    
    Ntty.c_lflag |=  ECHO;  


    Ntty.c_cc[VMIN]  = CMIN;    
    Ntty.c_cc[VTIME] = CTIME;   


    


    




    if ((error = tcsetattr(0, FLAG, Ntty)) == 0) {
        error  = read(0, ch, 1 );        
        error += tcsetattr(0, FLAG, Otty);   
    }

    return (error == 1 ?  ch : -1 );
}
