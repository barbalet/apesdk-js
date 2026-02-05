
/****************************************************************

    longterm.c

    =============================================================

 Copyright 1996-2025 Tom Barbalet. All rights reserved.

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or
    sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var _CRT_SECURE_NO_WARNINGS = null;
var CONSOLE_ONLY = null;
var CONSOLE_REQUIRED = null;
var simulation_filename;
var TIMING_CONST_MS = 100;
var count = 0;
var fake_input_string;
var fake_input_string_present;

function audit_print_offset(start, point, text) {
var _tmp = 0;
    printf( "%s %ld\n", text, ( point - start ) );
}

function audit_compart_offset() {
var _tmp = 0;
    if ( typeof AUDIT_FILE === "undefined" || !AUDIT_FILE )
    {
        return;
    }
    var local = {
        macro_state: 0,
        crowding: 0,
        parasites: 0,
        honor: 0,
        date_of_conception: [0],
        fetal_genetics: [0],
        genetics: [0],
        father_name: [0],
        social_x: 0,
        drives: [0],
        goal: [0],
        learned_preference: [0],
        generation_min: 0,
        territory: [0],
        immune_system: 0,
        vessel: new Array(28).fill(0),
        metabolism: [0],
        braincode_register: [0],
        brainprobe: [0],
        brain: 0
    };
var start = local;
    audit_print_offset( start,   ( local.macro_state ), "macro_state" );
    audit_print_offset( start,   ( local.crowding ), "crowding" );
    audit_print_offset( start,   ( local.parasites ), "parasites" );
    audit_print_offset( start,   ( local.honor ), "honor" );

    audit_print_offset( start,   ( local.date_of_conception[0] ), "date_of_conception[0]" );

    audit_print_offset( start,   ( local.fetal_genetics[0] ), "fetal_genetics[0]" );
    audit_print_offset( start,   ( local.genetics[0] ), "genetics[0]" );

    audit_print_offset( start,   ( local.father_name[0] ), "father_name[0]" );

    audit_print_offset( start,   ( local.social_x ), "social_x" );

    audit_print_offset( start,   ( local.drives[0] ), "drives[0]" );
    audit_print_offset( start,   ( local.goal[0] ), "goal[0]" );
    audit_print_offset( start,   ( local.learned_preference[0] ), "learned_preference[0]" );

    audit_print_offset( start,   ( local.generation_min ), "generation_min" );

    audit_print_offset( start,   ( local.territory[0] ), "territory[0]" );
    audit_print_offset( start,   ( local.immune_system ), "immune_system[0]" );

    audit_print_offset( start,   ( local.vessel[0] ), "vessel[0]" );
    audit_print_offset( start,   ( local.metabolism[0] ), "metabolism[0]" );

    audit_print_offset( start,   ( local.braincode_register[0] ), "braincode_register[0]" );
    audit_print_offset( start,   ( local.brainprobe[0] ), "brainprobe[0]" );

    audit_print_offset( start,   ( local.vessel[0] ), "vessel[0]" );
    audit_print_offset( start,   ( local.vessel[1] ), "vessel[1]" );
    audit_print_offset( start,   ( local.vessel[2] ), "vessel[2]" );
    audit_print_offset( start,   ( local.vessel[3] ), "vessel[3]" );
    audit_print_offset( start,   ( local.vessel[4] ), "vessel[4]" );
    audit_print_offset( start,   ( local.vessel[5] ), "vessel[5]" );
    audit_print_offset( start,   ( local.vessel[6] ), "vessel[6]" );
    audit_print_offset( start,   ( local.vessel[7] ), "vessel[7]" );
    audit_print_offset( start,   ( local.vessel[8] ), "vessel[8]" );
    audit_print_offset( start,   ( local.vessel[9] ), "vessel[9]" );
    audit_print_offset( start,   ( local.vessel[10] ), "vessel[10]" );
    audit_print_offset( start,   ( local.vessel[11] ), "vessel[11]" );
    audit_print_offset( start,   ( local.vessel[12] ), "vessel[12]" );
    audit_print_offset( start,   ( local.vessel[13] ), "vessel[13]" );
    audit_print_offset( start,   ( local.vessel[14] ), "vessel[14]" );
    audit_print_offset( start,   ( local.vessel[15] ), "vessel[15]" );
    audit_print_offset( start,   ( local.vessel[16] ), "vessel[16]" );
    audit_print_offset( start,   ( local.vessel[17] ), "vessel[17]" );
    audit_print_offset( start,   ( local.vessel[18] ), "vessel[18]" );
    audit_print_offset( start,   ( local.vessel[19] ), "vessel[19]" );
    audit_print_offset( start,   ( local.vessel[20] ), "vessel[20]" );
    audit_print_offset( start,   ( local.vessel[21] ), "vessel[21]" );
    audit_print_offset( start,   ( local.vessel[22] ), "vessel[22]" );
    audit_print_offset( start,   ( local.vessel[23] ), "vessel[23]" );
    audit_print_offset( start,   ( local.vessel[24] ), "vessel[24]" );
    audit_print_offset( start,   ( local.vessel[25] ), "vessel[25]" );
    audit_print_offset( start,   ( local.vessel[26] ), "vessel[26]" );
    audit_print_offset( start,   ( local.vessel[27] ), "vessel[27]" );

    audit_print_offset( start,   ( local.brain ), "brain" );
}

function audit() {
var _tmp = 0;
    if ( typeof AUDIT_FILE === "undefined" || !AUDIT_FILE )
    {
        return;
    }

    printf( "sizeof(n_byte) %d\n", sizeof("n_byte") );
    printf( "sizeof(n_byte2) %d\n", sizeof("n_byte2") );
    printf( "sizeof(n_uint) %d\n", sizeof("n_uint") );

    printf( "sizeof) %d \n", sizeof("n_byte *") );
    
    io_audit_file( simulated_file_format, FIL_BEI ); 
    audit_compart_offset();
}

function draw_error(error_text, location, line_number) {
var _tmp = 0;
    printf( "ERROR: %s @ %s %ld\n",  error_text, location, line_number );
    return -1;
}

function command_line_run() {
var _tmp = 0;
    sprintf( simulation_filename, "%s", "realtime.txt" );


    audit();


    srand(  time( null ) );
    sim_console( simulation_filename, rand() );

    return ( 1 );
}

function make_periodic(period, alarm_sig) {
var _tmp = 0;
    var ret;
    var value = { it_value: {}, it_interval: {} };

    
    sigemptyset( alarm_sig );
    sigaddset( alarm_sig, SIGALRM );
    pthread_sigmask( SIG_BLOCK, alarm_sig, null );

    
    value.it_value.tv_sec = period / 1000000;
    value.it_value.tv_usec = period % 1000000;
    value.it_interval.tv_sec = period / 1000000;
    value.it_interval.tv_usec = period % 1000000;
    ret = setitimer( ITIMER_REAL, value, null );
    if ( ret != 0 )
    {
        perror( "Failed to set timer" );
    }
    return ret;
}

function wait_period(alarm_sig) {
var _tmp = 0;
    var sig;
    
    sigwait( alarm_sig, sig );
}

function periodic_thread(arg) {
var _tmp = 0;
    var alarm_sig;
    var group = null;
    make_periodic( 1000 * TIMING_CONST_MS, alarm_sig );
    while ( 1 )
    {
        group = sim_group();
        if ( !group )
        {
            wait_period( alarm_sig );
            continue;
        }
        sim_cycle();
        count++;
        if ( ( count & 2047 ) == 0 )
        {
            printf( "count is %ld\n", count );
        }
        if ( group.num == 0 )
        {
            printf( "new run at %ld\n", count );

            sim_init( 1, rand(), MAP_AREA, 0 );
        }

        wait_period( alarm_sig );
    }
    return null;
}

function fake_input(value, length) {
var _tmp = 0;
//    fgets( value, STRING_BLOCK_SIZE, stdin );
    if (fake_input_string_present) {
        memory_copy(fake_input_string, value, length);
        fake_input_string_present = 2;
    }
    return value;
}

function fake_output(value) {
var _tmp = 0;
    printf("%s\n", value);
}

function python_init() {
var _tmp = 0;
    sim_set_console_input( fake_input);
    sim_set_console_output( fake_output );
    
    srand(  time( null ) );

    printf( "\n *** %sConsole, %s ***\n", SHORT_VERSION_NAME, FULL_DATE );
    printf( "      For a list of commands type 'help'\n\n" );

    io_command_line_execution_set();
    sim_init( KIND_START_UP, rand(), MAP_AREA, 0 );
}

function python_close() {
var _tmp = 0;
    sim_close();
}

function python_quit_check() {
var _tmp = 0;
    return (sim_thread_console_quit() == 0);
}

function python_check_string(incoming) {
var _tmp = 0;
    memory_erase(fake_input_string, STRING_BLOCK_SIZE);
    memory_copy(incoming, fake_input_string, strlen(incoming));
    fake_input_string_present = 1;
    sim_thread_console();
    if (fake_input_string_present == 2) {
        printf("Erase!\n");
        memory_erase(fake_input_string, STRING_BLOCK_SIZE);
        fake_input_string_present = 0;
    }
}

function main(argc, argv) {
var _tmp = 0;
    python_init();
    
    while ( python_quit_check() )
    {
var example = [0];
        fgets( example, STRING_BLOCK_SIZE, stdin );
        python_check_string(example);
    }
    
    python_close();

    return 1;
}

function main_command_line_run(argc, argv) {
var _tmp = 0;
    return command_line_run();
}
