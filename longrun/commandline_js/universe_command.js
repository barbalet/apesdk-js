/* command.c */

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var _CRT_SECURE_NO_WARNINGS = null;
var REMOVE_BOLDING_TEXT = null;
var simulation_running = 1;
var simulation_executing = 0;
var RUN_STEP_CONST = "RSC";
var watch_type = WATCH_NONE;
var watch_string_length = 0;
var nolog = 0;
var indicator_index = 1;
var save_interval_steps = 60;
var command_file_interaction = 0;
var command_file_name;
var FILE_CHECK = (...args) => (null);
var interval_steps = [1, TIME_HOUR_MINUTES, TIME_DAY_MINUTES, TIME_MONTH_MINUTES, TIME_YEAR_MINUTES];
var interval_description = [ " mins", " hours", " days", " months", " years" ];
var command_friends_first = new Array(SOCIAL_SIZE_BEINGS);
var command_friends_family = new Array(SOCIAL_SIZE_BEINGS);
var command_friends_count;
var command_enemies_first = new Array(SOCIAL_SIZE_BEINGS);
var command_enemies_family = new Array(SOCIAL_SIZE_BEINGS);
var command_enemies_count;
var command_attract_first = new Array(SOCIAL_SIZE_BEINGS);
var command_attract_family = new Array(SOCIAL_SIZE_BEINGS);
var command_attract_count;
var static_result;

function command_offset(start, point, text) {
var _tmp = 0;
    printf( "%s %ld\n", text, ( point - start ) );
}

function command_executing() {
var _tmp = 0;
    return simulation_executing;
}

function command_being(ptr, response, output_function) {
var _tmp = 0;
var group =  ptr;
    output_function( being_get_select_name( group ) );
    return 0;
}

function command_relationship_count(friend_type) {
var _tmp = 0;
    switch ( friend_type )
    {
    case 0:   
        return command_friends_count;
    case 1:   
        return command_enemies_count;
    case 2:   
        return command_attract_count;
    }
    return 0;
}

function command_relationship_being(group, friend_type, location) {
var _tmp = 0;
    var first_name_look_up;
    var family_name_look_up;
var loop = 0;
    switch ( friend_type )
    {
    case 0:   
        first_name_look_up = command_friends_first[location];
        family_name_look_up = command_friends_family[location];
        break;
    case 1:   
        first_name_look_up = command_enemies_first[location];
        family_name_look_up = command_enemies_family[location];
        break;
    case 2:   
        first_name_look_up = command_friends_first[location];
        family_name_look_up = command_friends_family[location];
        break;
    default:
        return 0;
    }
    while ( loop < group.num )
    {
var local = group.beings[loop];
        if ( ( being_gender_name( local ) == first_name_look_up ) && ( being_family_name( local ) == family_name_look_up ) )
        {
            return local;
        }
        loop++;
    }
    return 0;
}

function command_show_friends_being(ptr, local_being, friend_type, result, four_characters) {
var _tmp = 0;
var group =  ptr;
    var i, found, attraction;
    var local_social_graph;
var first = 1;

    if ( local_being == 0 )
    {
        return;
    }

    
    local_social_graph = being_social( local_being );

    if ( local_social_graph == 0 )
    {
        return;
    }

    switch ( friend_type )
    {
    case 0:   
        command_friends_count = 0;
        break;
    case 1:   
        command_enemies_count = 0;
        break;
    case 2:   
        command_attract_count = 0;
        break;
    }
    
    for ( i = 1; i < SOCIAL_SIZE_BEINGS; i++ )
    {
        
        if ( SOCIAL_GRAPH_ENTRY_EMPTY( local_social_graph, i ) )
        {
            continue;
        }

        found = 0;
        attraction = 0;
        switch ( friend_type )
        {
        case 0:   
        {
            if ( local_social_graph[i].friend_foe >= social_respect_mean( local_being ) )
            {
                if ( local_social_graph[i].entity_type == ENTITY_BEING )
                {
                    if ( local_social_graph[i].attraction > 0 )
                    {
                        attraction = 1;

                    }
                    command_friends_first[command_friends_count] = local_social_graph[i].first_name[BEING_MET];
                    command_friends_family[command_friends_count] = local_social_graph[i].family_name[BEING_MET];
                    command_friends_count++;
                }
                found = 1;
            }
            break;
        }
        case 1:   
        {
            if ( local_social_graph[i].friend_foe < social_respect_mean( local_being ) )
            {
                if ( local_social_graph[i].entity_type == ENTITY_BEING )
                {
                    if ( local_social_graph[i].attraction > 0 )
                    {
                        attraction = 1;
                    }
                    command_enemies_first[command_enemies_count] = local_social_graph[i].first_name[BEING_MET];
                    command_enemies_family[command_enemies_count] = local_social_graph[i].family_name[BEING_MET];
                    command_enemies_count++;
                }
                found = 1;
            }
            break;
        }
        case 2:   
        {
            if ( local_social_graph[i].attraction > 0 )
            {
                if ( local_social_graph[i].entity_type == ENTITY_BEING )
                {
                    command_attract_first[command_attract_count] = local_social_graph[i].first_name[BEING_MET];
                    command_attract_family[command_attract_count] = local_social_graph[i].family_name[BEING_MET];
                    command_attract_count++;
                }
                found = 1;
            }
            break;
        }
        }

        if ( found == 1 )
        {
            var relationship_index;
            var relationship_str1;
            var relationship_str2;
            var met_being_name;
            var result_str;

            
            social_graph_link_name( group, local_being, i, BEING_MET, met_being_name );

            

            relationship_index = local_social_graph[i].relationship;

            if ( relationship_index > RELATIONSHIP_SELF )
            {
                being_relationship_description( relationship_index, relationship_str1 );

                if ( IS_FAMILY_MEMBER( local_social_graph, i ) )
                {
                    io_three_strings( relationship_str2, " (", relationship_str1, ")", 0 );
                }
                else
                {
                    var meeter_being_name;
                    var string_of_strings;
                    io_three_strings( meeter_being_name, " ", "", "", 0 );
                    social_graph_link_name( group, local_being, i, BEING_MEETER, meeter_being_name );
                    io_three_strings( string_of_strings, relationship_str1, " of *", meeter_being_name, 0 );

                    io_three_strings( relationship_str2, " ", string_of_strings, "*", 0 );

                    io_three_strings( relationship_str2, " <", string_of_strings, "*>", 0 );

                }
            }
            else
            {
                io_three_strings( relationship_str2, " ", "", "", 0 );
            }

            if ( i != being_attention( local_being, ATTENTION_ACTOR ) )
            {
                

                if ( first )
                {
                    sprintf( result_str, "%s%05d  *%s*%s %ld\n", four_characters, local_social_graph[i].familiarity, met_being_name, relationship_str2, attraction );
                    first = 0;
                }
                else
                {
                    sprintf( result_str, "    %05d  *%s*%s %ld\n", local_social_graph[i].familiarity, met_being_name, relationship_str2, attraction );
                }
            }
            else
            {
                if ( first )
                {
                    

                    sprintf( result_str, "%s %05d *%s*%s %ld\n", four_characters, local_social_graph[i].familiarity, met_being_name, relationship_str2, attraction );

                    sprintf( result_str, "%s %05d <*%s*>%s %ld\n", four_characters, local_social_graph[i].familiarity, met_being_name, relationship_str2, attraction );

                    first = 0;
                }
                else
                {

                    sprintf( result_str, "    %05d *%s*%s %ld\n", local_social_graph[i].familiarity, met_being_name, relationship_str2, attraction );

                    sprintf( result_str, "    %05d <*%s*>%s %ld\n", local_social_graph[i].familiarity, met_being_name, relationship_str2, attraction );

                }
            }
            
            io_string_write( result, result_str, watch_string_length );
        }
    }
}

function command_show_friends(ptr, beingname, friend_type, result) {
var _tmp = 0;
var group =  ptr;
    var local_being;
var local_being_name = io_string_copy( beingname );
    
    local_being = being_from_name( group, local_being_name );
    memory_free( local_being_name );

    if ( local_being == 0 )
    {
        return;
    }

    command_show_friends_being( ptr, local_being, friend_type, result, "        " );
}

function get_time_interval(str, number, interval) {
var _tmp = 0;
    var i, index = 0, ctr = 0, result = 0, divisor = 0;
    var c;
    var buf = new Array(256);
var retval = -1;
var length = io_length( str, 256 );
    var set_out = (ref, value) => {
        if (!ref || typeof ref !== 'object') return;
        if (Array.isArray(ref)) {
            ref[0] = value;
            return;
        }
        if ('value' in ref) {
            ref.value = value;
        }
    };

    for ( i = 0; i < length; i++ )
    {
        if ( str[i] != ' ' )
        {
            buf[ctr++] = str[i];
        }

        if ( ( str[i] == ' ' ) || ( i == ( length - 1 ) ) )
        {
            buf[ctr] = 0;

            switch ( index )
            {
            case 0:
            {
                result = io_number( buf );
                set_out( number, result );
                retval = 0;
                break;
            }
            case 1:
            {
                if ( ctr == 1 )
                {
                    var lower_c;
                    lower_c = c = buf[0];
                    lower_c = IO_LOWER_CHAR( lower_c );
                    if ( c == 'm' )
                    {
                        set_out( interval, INTERVAL_MINS );
                    }
                    if ( lower_c == 'h' )
                    {
                        set_out( interval, INTERVAL_HOURS );
                    }
                    if ( lower_c == 'd' )
                    {
                        set_out( interval, INTERVAL_DAYS );
                    }
                    if ( c == 'M' )
                    {
                        set_out( interval, INTERVAL_MONTHS );
                    }
                    if ( lower_c == 'y' )
                    {
                        set_out( interval, INTERVAL_YEARS );
                    }
                }
                else
                {
                    buf[0] = IO_LOWER_CHAR( buf[0] );
                    if ( io_find( buf, 0, ctr, "min", 3 ) > -1 )
                    {
                        set_out( interval, INTERVAL_MINS );
                    }
                    if ( ( io_find( buf, 0, ctr, "hour", 4 ) > -1 ) ||
                            ( io_find( buf, 0, ctr, "hr", 2 ) > -1 ) )
                    {
                        set_out( interval, INTERVAL_HOURS );
                    }
                    if ( io_find( buf, 0, ctr, "day", 3 ) > -1 )
                    {
                        set_out( interval, INTERVAL_DAYS );
                    }
                    if ( io_find( buf, 0, ctr, "mon", 3 ) > -1 )
                    {
                        set_out( interval, INTERVAL_MONTHS );
                    }
                }

                break;
            }
            }

            index++;
            ctr = 0;
        }
    }
    return retval;
}

function command_simulation_loop(group, local_being, data) {
var _tmp = 0;
var int_data = data;
    if ( FIND_SEX( GET_I( local_being ) ) == SEX_FEMALE )
    {
        int_data[0]++;
    }
    if ( ( land_date() - being_dob( local_being ) ) < AGE_OF_MATURITY )
    {
        int_data[1]++;
    }
}

function command_simulation(ptr, response, output_function) {
var _tmp = 0;
var group =  ptr;
var timing = sim_timing();
    var beingstr = new Array( STRING_BLOCK_SIZE );
    var time = new Array( STRING_BLOCK_SIZE );
    var int_data = new Array(2);
var local_land_genetics = land_genetics();
    var land_dimension = new Array( STRING_BLOCK_SIZE );
    var land_genetics0 = new Array( STRING_BLOCK_SIZE );
    var land_genetics1 = new Array( STRING_BLOCK_SIZE );
    var genetics = new Array( STRING_BLOCK_SIZE );
    var population = new Array( STRING_BLOCK_SIZE );
    var adults = new Array( STRING_BLOCK_SIZE );
    var juveniles = new Array( STRING_BLOCK_SIZE );
    var tide_level = new Array( STRING_BLOCK_SIZE );

    loop_no_thread( group, 0, command_simulation_loop, int_data );

    io_number_to_string( land_dimension, land_map_dimension() );
    io_number_to_string( land_genetics0, local_land_genetics[0] );
    io_number_to_string( land_genetics1, local_land_genetics[1] );
    io_number_to_string( population, group.num );

    io_number_to_string( adults, ( ( group.num ) - int_data[1] ) );
    io_number_to_string( juveniles, int_data[1] );

    io_number_to_string( tide_level, land_tide_level() );

    io_three_strings( beingstr, "Map dimension: ", land_dimension, "", 1 );

    io_three_strings( genetics, land_genetics0, " ", land_genetics1, 0 );

    io_three_strings( beingstr, beingstr, "Land seed: ", genetics, 1 );
    io_three_strings( beingstr, beingstr, "Population: ", population, 1 );
    io_three_strings( beingstr, beingstr, "Adults: ", adults, 0 );
    io_three_strings( beingstr, beingstr, "   Juveniles: ", juveniles, 1 );


    if ( group.num > 0 )
    {
        var males = new Array( STRING_BLOCK_SIZE );
        var females = new Array( STRING_BLOCK_SIZE );
        var males_percent = new Array( STRING_BLOCK_SIZE );
        var females_percent = new Array( STRING_BLOCK_SIZE );
        io_number_to_string( males, ( group.num - int_data[0] ) );
        io_number_to_string( females, int_data[0] );

        io_number_to_string( males_percent, ( ( group.num - int_data[0] ) * 100 ) / group.num );
        io_number_to_string( females_percent, ( int_data[0] * 100 ) / group.num );

        io_three_strings( beingstr, beingstr, "Females: ", females, 0 );
        io_three_strings( beingstr, beingstr, " (", females_percent, 0 );
        io_three_strings( beingstr, beingstr, "%)   Males: ", males, 0 );
        io_three_strings( beingstr, beingstr, " (", males_percent, 0 );
        io_three_strings( beingstr, beingstr, "%)", "", 1 );
    }

    io_three_strings( beingstr, beingstr, "Tide level: ", tide_level, 1 );

    time = spacetime_to_string( time );

    if ( timing.delta_cycles )
    {
        var delta_cycles = new Array( STRING_BLOCK_SIZE );

        io_number_to_string( delta_cycles, timing.delta_cycles );

        io_three_strings( beingstr, beingstr, "Brain Cycles Per Second: ", delta_cycles, 1 );
    }

    if ( simulation_executing )
    {
        io_three_strings( beingstr, beingstr, time, " Simulation running", 0 );
    }
    else
    {
        io_three_strings( beingstr, beingstr, time, " Simulation not running", 0 );
    }

    output_function( beingstr );

    return 0;
}

function command_list(ptr, response, output_function) {
var _tmp = 0;
var group =  ptr;

    var local_being;
    var line_text = new Array( STRING_BLOCK_SIZE );
var location = 0;
var loop = 0;

    if ( group.num == 0 )
    {
        output_function( "No apes present. Trying (re)running the Simulation" );
        return 0;
    }

    
    while ( loop < group.num )
    {
        var name = new Array( STRING_BLOCK_SIZE );
        var length;
        
        local_being = group.beings[loop];

        
        name = being_name_simple( local_being, name );

        io_string_write( line_text, name, location );

        length = io_length( name, STRING_BLOCK_SIZE );

        while ( length < 24 )
        {
            io_string_write( line_text, " ", location );
            length++;
        }

        if ( ( loop % 3 ) == 2 )
        {
            output_function( line_text );
            location = 0;
        }
        loop++;
    }

    if ( location != 0 )
    {
        output_function( line_text );
    }

    return 0;
}

function command_change_selected(group, forwards) {
var _tmp = 0;
var local_select = group.select;
var first = group.beings;
var last = ( group.beings[group.num - 1] );
    if ( forwards )
    {
        if ( group.select != last )
        {
            local_select++;
        }
        else
        {
            local_select = first;
        }
    }
    else
    {
        if ( group.select != first )
        {
            local_select--;
        }
        else
        {
            local_select = last;
        }
    }
    sim_set_select( local_select );
}

function command_check_ape_present(ptr, output_function) {
var _tmp = 0;
var group =  ptr;

    if ( group.select )
    {
        return 1;
    }
    if ( group.num )
    {
        output_function( "No apes selected." );
    }
    else
    {
        output_function( "No apes selected. Trying (re)running the Simulation" );
    }
    return 0;
}

function command_next(ptr, response, output_function) {
var _tmp = 0;
    if ( command_check_ape_present( ptr, output_function ) )
    {
        command_change_selected(  ptr, 1 );
    }
    return 0;
}

function command_previous(ptr, response, output_function) {
var _tmp = 0;
    if ( command_check_ape_present( ptr, output_function ) )
    {
        command_change_selected(  ptr, 0 );
    }
    return 0;
}

function command_populate_braincode(group, function_) {
var _tmp = 0;
    if ( group.select )
    {
var local_being = group.select;
var internal_bc = being_braincode_internal( local_being );
var external_bc = being_braincode_external( local_being );
var loop = 0;

        var initial_information;
var position = 0;

        io_string_write( initial_information, "EXT                                                         INT", position );

        function_( initial_information, -1 );

        while ( loop < 22 )
        {
            var command_information;

            var first_internal;
            var first_external;

            position = 0;

            brain_three_byte_command( first_internal, internal_bc[loop * BRAINCODE_BYTES_PER_INSTRUCTION] );
            brain_three_byte_command( first_external, external_bc[loop * BRAINCODE_BYTES_PER_INSTRUCTION] );

            if ( loop == 21 )
            {
                io_string_write( command_information, first_external, position );
                io_string_write( command_information, "                   ", position );
                io_string_write( command_information, first_internal, position );
            }
            else
            {
                var second_internal;
                var second_external;

                brain_three_byte_command( second_internal, internal_bc[( loop + 22 )*BRAINCODE_BYTES_PER_INSTRUCTION] );
                brain_three_byte_command( second_external, external_bc[( loop + 22 )*BRAINCODE_BYTES_PER_INSTRUCTION] );

                io_string_write( command_information, first_external, position );
                io_string_write( command_information, "  ", position );
                io_string_write( command_information, second_external, position );
                io_string_write( command_information, "   ", position );
                io_string_write( command_information, first_internal, position );
                io_string_write( command_information, "  ", position );
                io_string_write( command_information, second_internal, position );
            }
            function_( command_information, loop );
            loop++;
        }
    }

}

function watch_appearance(ptr, beingname, local_being, result) {
var _tmp = 0;
    var str;
var genetics = being_genetics( local_being );

    sprintf( str, "Height: %.3 m\n", GET_BEING_HEIGHT( local_being ) / 1000.0 );
    io_string_write( result, str, watch_string_length );

    sprintf( str, "Mass: %.2 Kg\n", GET_M( local_being ) / 100.0 );
    io_string_write( result, str, watch_string_length );

    sprintf( str, "Body fat: %.2 Kg\n", GET_BODY_FAT( local_being ) / 100.0 );
    io_string_write( result, str, watch_string_length );

    sprintf( str, "Hair length: %.1 mm\n", ( GENE_HAIR( genetics ) * 100.0 / 160.0 ) );
    io_string_write( result, str, watch_string_length );

    sprintf( str, "Pigmentation: %02d\n", ( GENE_PIGMENTATION( genetics ) ) );
    io_string_write( result, str, watch_string_length );

    sprintf( str, "Body frame: %02d\n", ( GENE_FRAME( genetics ) ) );
    io_string_write( result, str, watch_string_length );

    sprintf( str, "Eye separation: %.1 mm\n",
             80.0 + ( ( GENE_EYE_SEPARATION( genetics ) ) ) );
    io_string_write( result, str, watch_string_length );

    sprintf( str, "Eye color: %02d       Eye shape: %02d\n",
             ( GENE_EYE_COLOR( genetics ) ),
             ( GENE_EYE_SHAPE( genetics ) ) );
    io_string_write( result, str, watch_string_length );

    sprintf( str, "Nose shape: %02d      Ear shape: %02d\n",
             ( GENE_NOSE_SHAPE( genetics ) ),
             ( GENE_EAR_SHAPE( genetics ) ) );
    io_string_write( result, str, watch_string_length );

    sprintf( str, "Eyebrow shape: %02d   Mouth shape: %02d\n",
             ( GENE_EYEBROW_SHAPE( genetics ) ),
             ( GENE_MOUTH_SHAPE( genetics ) ) );
    io_string_write( result, str, watch_string_length );
}

function watch_line_braincode(string, line) {
var _tmp = 0;
    io_string_write( static_result, string, watch_string_length );
    io_string_write( static_result, "\n", watch_string_length );
}

function watch_braincode(ptr, beingname, local_being, result) {
var _tmp = 0;

    var i;
    io_string_write( result, "\nRegisters:\n", watch_string_length );
    for ( i = 0; i < BRAINCODE_PSPACE_REGISTERS; i++ )
    {
        result[watch_string_length++] = ( 65 + ( local_being.braindata.braincode_register[i] % 60 ) );
    }
    result[watch_string_length++] = '\n';
    result[watch_string_length++] = '\n';

    static_result = result;

    command_populate_braincode( ptr, watch_line_braincode );

    static_result = 0;
    result[watch_string_length++] = '\n';

}

function watch_speech(ptr, beingname, local, result) {
var _tmp = 0;

    var loop;
var external_bc = being_braincode_external( local );
    for ( loop = 0; loop < BRAINCODE_SIZE / BRAINCODE_BYTES_PER_INSTRUCTION; loop++ )
    {
        var sentence;

        brain_sentence( sentence, external_bc[loop * 3] );

        io_string_write( result, sentence, watch_string_length );
        if ( ( loop & 3 ) == 3 )
        {
            result[watch_string_length++] = '.';
        }
        if ( loop < BRAINCODE_SIZE / BRAINCODE_BYTES_PER_INSTRUCTION - 1 )
        {
            result[watch_string_length++] = ' ';
        }
    }
    result[watch_string_length++] = '.';
    result[watch_string_length++] = '\n';

}

function watch_social_graph(ptr, beingname, local_being, result) {
var _tmp = 0;
    io_string_write( result, "\nFriends:\n", watch_string_length );
    command_show_friends( ptr, beingname, 0, result );
    io_string_write( result, "\nEnemies:\n", watch_string_length );
    command_show_friends( ptr, beingname, 1, result );
}

function watch_pathogen_graph(ptr, beingname, local_being, result) {
var _tmp = 0;

    var j;
    var antibodies = [0];
    var antigens = [0];

var immune = ( local_being.immune_system );
    for ( j = 0; j < IMMUNE_POPULATION; j++ )
    {
        antibodies[immune.shape_antibody[j]]++;
    }
    for ( j = 0; j < IMMUNE_ANTIGENS; j++ )
    {
        antigens[immune.shape_antigen[j]]++;
    }

    for ( j = 0; j < 256; j++ )
    {
        if ( antibodies[j] != 0 )
        {
            var result_str;
            sprintf( result_str, "AB( %ld ) = %ld\n", j,  antibodies[j] );
            io_string_write( result, result_str, watch_string_length );
        }
        if ( antigens[j] != 0 )
        {
            var result_str;
            sprintf( result_str, "AG( %ld ) = %ld\n", j,  antigens[j] );
            io_string_write( result, result_str, watch_string_length );
        }
    }

}

function watch_episodic(ptr, beingname, local_being, result) {
var _tmp = 0;
    var i;
    for ( i = 0; i < EPISODIC_SIZE; i++ )
    {
var str = [0];
var description = [0];
var position = 0;
        episode_description( local_being, i, str );
        if ( io_length( str, STRING_BLOCK_SIZE ) > 0 )
        {

            io_string_write( description, "  ", position );
            io_string_write( description, str, position );
            io_string_write( description, "\n", position );

            if ( being_attention( local_being, ATTENTION_EPISODE ) != i )
            {
                io_string_write( description, "  ", position );
                io_string_write( description, str, position );
                io_string_write( description, "\n", position );
            }
            else
            {
                io_string_write( description, " <", position );
                io_string_write( description, str, position );
                io_string_write( description, ">\n", position );
            }

            io_string_write( result, description, watch_string_length );
        }
    }
}

function watch_genome(ptr, beingname, local_being, result) {
var _tmp = 0;
    var i, j;
    var genome = new Array(CHROMOSOMES * 8 + 1);

    for ( i = 0; i < 2; i++ )
    {
        body_genome( i, being_genetics( local_being ), genome );
        for ( j = 0; j < CHROMOSOMES * 8; j++ )
        {
            if ( ( j > 0 ) && ( j % 8 == 0 ) )
            {
                io_string_write( result, "\t", watch_string_length );
            }
            result[watch_string_length++] = genome[j];
        }
        io_string_write( result, "\n", watch_string_length );
    }
}

function watch_brainprobes(ptr, beingname, local_being, result) {
var _tmp = 0;

    var i;
    var str2;
    var type_str;
    io_string_write( result, "\n  Type    Posn  Freq Offset Addr State\n  ", watch_string_length );
    for ( i = 0; i < 36; i++ )
    {
        io_string_write( result, "-", watch_string_length );
    }
    io_string_write( result, "\n", watch_string_length );

    io_three_strings( type_str, "Input ", "", "", 0 );
    for ( i = 0; i < BRAINCODE_PROBES; i++ )
    {
        if ( local_being.braindata.brainprobe[i].type == INPUT_SENSOR )
        {
            sprintf( str2, "  %s  %03d   %02d   %03d    %03d  %d\n",
                     type_str,
                     local_being.braindata.brainprobe[i].position,
                     local_being.braindata.brainprobe[i].frequency,
                     local_being.braindata.brainprobe[i].offset,
                     local_being.braindata.brainprobe[i].address,
                     local_being.braindata.brainprobe[i].state );
            io_string_write( result, str2, watch_string_length );
        }
    }

    io_three_strings( type_str, "Output ", "", "", 0 );

    for ( i = 0; i < BRAINCODE_PROBES; i++ )
    {
        if ( local_being.braindata.brainprobe[i].type == OUTPUT_ACTUATOR )
        {
            sprintf( str2, "  %s  %03d   %02d   %03d    %03d  %d\n",
                     type_str,
                     local_being.braindata.brainprobe[i].position,
                     local_being.braindata.brainprobe[i].frequency,
                     local_being.braindata.brainprobe[i].offset,
                     local_being.braindata.brainprobe[i].address,
                     local_being.braindata.brainprobe[i].state );
            io_string_write( result, str2, watch_string_length );
        }
    }

}

function watch_resolve_drives(drives) {
var _tmp = 0;
var max_value = 0;
var loop = 0;
var dominant = -1;
    while ( loop < DRIVES )
    {
        if ( drives[loop] > max_value )
        {
            max_value = drives[loop];
            dominant = loop;
        }
        loop++;
    }
    loop = 0;
    while ( loop < DRIVES )
    {
        if ( ( drives[loop] > ( max_value / 2 ) ) && ( loop != dominant ) )
        {
            return "Mixed drives";
        }
        loop++;
    }
    if ( dominant == DRIVE_SEX )
    {

        return "Find mate";
    }
    if ( dominant == DRIVE_HUNGER )
    {

        return "Find food";
    }
    if ( dominant == DRIVE_SOCIAL )
    {
        return "Find friends";
    }
    if ( dominant == DRIVE_FATIGUE )
    {

        return "Find rest";
    }
    return "No Drive";
}

function watch_sixteenth_wind(facing) {
var _tmp = 0;
var round_facing = facing + 7;
    return sixteen_wind[( round_facing >> 4 ) & 15];
}

function watch_stats(ptr, beingname, local_being, result) {
var _tmp = 0;
    var str;
    var relationship_str;
    var status;

    if ( local_being == 0 )
    {
        SHOW_ERROR( "No being for stats" );
        return;
    }

    being_state_description( being_state( local_being ), status );
    being_relationship_description( being_attention( local_being, ATTENTION_RELATIONSHIP ), relationship_str );

    sprintf( str, "%s (%ld %ld) %s\n%s: %s\nGen %lu:%lu  %s  ERG:%ld SPD:%ld\nHonor:%d  HEI:%ld  Days Old:%ld\n",
             beingname,
             being_location_x( local_being ) / 16, being_location_y( local_being ) / 16,
             watch_sixteenth_wind( being_facing( local_being ) ),
             watch_resolve_drives( being_drives( local_being ) ),
             status,
             local_being.constant.generation_min,
             local_being.constant.generation_max,
             ( ( FIND_SEX( GET_I( local_being ) ) == SEX_FEMALE ) ? "Female" : "Male  " ),
             being_energy( local_being ),
             being_ten_minute_distance( local_being ),

             being_honor( local_being ),
             GET_BEING_HEIGHT( local_being ),
             land_date() - being_dob( local_being )
           );

    io_string_write( result, str, watch_string_length );

    if ( being_pregnant( local_being ) )
    {
        sprintf( str, "Days Preg: %ld\n", land_date() - being_pregnant( local_being ) );
        io_string_write( result, str, watch_string_length );
    }
    sprintf( str, "Aware Body: %s Link: %s\n", being_body_inventory_description( being_attention( local_being, ATTENTION_BODY ) ),
             relationship_str );

    io_string_write( result, str, watch_string_length );

    io_string_write( result, "Friend\n", watch_string_length );
    command_show_friends_being( ptr, local_being, 0, result, "    " );
    io_string_write( result, "Enemy\n", watch_string_length );
    command_show_friends_being( ptr, local_being, 1, result, "    " );
    io_string_write( result, "\n", watch_string_length );
    watch_episodic( ptr, beingname, local_being, result );
}

function watch_control(ptr, beingname, local_being, result) {
var _tmp = 0;
    watch_string_length = 0;
    watch_stats( ptr, beingname, local_being, result );
}

function command_duplicate(ptr, response, output_function, title, watch_function) {
var _tmp = 0;
var group =  ptr;

var local_being = 0;
    var beingstr;

    watch_string_length = 0;

    if ( ( response == 0 ) && ( group.select ) )
    {
        response = being_get_select_name( group );
        if ( title != 0 )
        {
            io_string_write( beingstr, "\n", watch_string_length );
            io_string_write( beingstr, title, watch_string_length );
            io_string_write( beingstr, " for ", watch_string_length );
            io_string_write( beingstr, response, watch_string_length );
            io_string_write( beingstr, "\n", watch_string_length );
        }
    }

    if ( response != 0 )
    {
        local_being = being_from_name( group, response );
        if ( local_being == 0 )
        {
            SHOW_ERROR( "Being not found" );
            return 0;
        }
        being_set_select_name( group, response );

        watch_function( ptr, being_get_select_name( group ), local_being, beingstr );
        beingstr[watch_string_length] = 0;
        output_function( beingstr );
        return 0;
    }

    SHOW_ERROR( "No being was specified" );
    return 0;
}

function command_genome(ptr, response, output_function) {
var _tmp = 0;
    return command_duplicate( ptr, response, output_function, "Genome", watch_genome );
}

function command_stats(ptr, response, output_function) {
var _tmp = 0;
    return command_duplicate( ptr, response, output_function, 0, watch_stats );
}

function command_probes(ptr, response, output_function) {
var _tmp = 0;
    return command_duplicate( ptr, response, output_function, "Brain probes", watch_brainprobes );
}

function command_episodic(ptr, response, output_function) {
var _tmp = 0;
    return command_duplicate( ptr, response, output_function, "Episodic memory", watch_episodic );
}

function command_pathogen_graph(ptr, response, output_function) {
var _tmp = 0;
    return command_duplicate( ptr, response, output_function, "Pathogen graph", watch_pathogen_graph );
}

function command_social_graph(ptr, response, output_function) {
var _tmp = 0;
    return command_duplicate( ptr, response, output_function, "Social graph", watch_social_graph );
}

function command_braincode(ptr, response, output_function) {
var _tmp = 0;
    return command_duplicate( ptr, response, output_function, "Braincode", watch_braincode );
}

function command_speech(ptr, response, output_function) {
var _tmp = 0;
    return command_duplicate( ptr, response, output_function, "Speech", watch_speech );
}

function command_appearance(ptr, response, output_function) {
var _tmp = 0;
    return command_duplicate( ptr, response, output_function, "Appearance", watch_appearance );
}

function histogram_being_state_loop(group, local_being, data) {
var _tmp = 0;
var histogram = data;
var n = 2;
    if ( being_state( local_being ) == BEING_STATE_ASLEEP )
    {
        histogram[0]++;
    }
    else
    {
        while ( n < BEING_STATES )
        {
            if ( being_state( local_being ) & ( 1 << ( n - 1 ) ) )
            {
                histogram[n]++;
            }
            n++;
        }
    }
}

function histogram_being_state(group, histogram, normalize) {
var _tmp = 0;
    var i;

    for ( i = 0; i < BEING_STATES; i++ )
    {
        histogram[i] = 0;
    }

    loop_no_thread( group, 0, histogram_being_state_loop, histogram );

    if ( normalize )
    {
var tot = 0;
        for ( i = 0; i < BEING_STATES; i++ )
        {
            tot += histogram[i];
        }
        if ( tot > 0 )
        {
            for ( i = 0; i < BEING_STATES; i++ )
            {
                histogram[i] = histogram[i] * 1000 / tot;
            }
        }
    }
}

function watch_being(ptr, output_function) {
var _tmp = 0;
var group =  ptr;
    var local_being;
    var beingstr = new Array( STRING_BLOCK_SIZE );
    var i;
    var j;
    var state;


    if ( being_remove_internal() )
    {
        do {}
        while ( being_remove_internal() );
    }

    being_remove_external_set( 1 );

    if ( watch_type == WATCH_STATES )
    {
        var histogram = new Array(16);
        var str = new Array( STRING_BLOCK_SIZE );

        watch_string_length = 0;

        str = spacetime_to_string( str );
        io_string_write( beingstr, str, watch_string_length );
        histogram_being_state( group, histogram, 1 );
        for ( i = 0; i < BEING_STATES; i++ )
        {
            if ( i == 1 )
            {
                continue;    
            }

            if ( i == 0 )
            {
                state = 0;
            }
            else
            {
                state = ( 1 << ( i - 1 ) );
            }

            being_state_description( state, str );
            io_string_write( beingstr, str, watch_string_length );
            io_string_write( beingstr, ":", watch_string_length );
            for ( j = 0; j < 12 - io_length( str, STRING_BLOCK_SIZE ); j++ )
            {
                io_string_write( beingstr, " ", watch_string_length );
            }

            if ( histogram[i] > 0 )
            {
                sprintf( str, "%.1\n", histogram[i] / 10.0 );
                io_string_write( beingstr, str, watch_string_length );
            }
            else
            {
                io_string_write( beingstr, "----\n", watch_string_length );
            }
        }
        output_function( beingstr );
        return;
    }

    if ( group.select )
    {
        local_being = group.select;

        watch_string_length = 0;

        switch ( watch_type )
        {
        case WATCH_ALL:
        {
            watch_stats( ptr, being_get_select_name( group ), local_being, beingstr );
            break;
        }
        case WATCH_SOCIAL_GRAPH:
        {
            watch_social_graph( ptr, being_get_select_name( group ), local_being, beingstr );
            break;
        }
        case WATCH_EPISODIC:
        {
            watch_episodic( ptr, being_get_select_name( group ), local_being, beingstr );
            break;
        }
        case WATCH_BRAINCODE:
        {
            watch_braincode( ptr, being_get_select_name( group ), local_being, beingstr );
            break;
        }
        case WATCH_BRAINPROBES:
        {
            watch_brainprobes( ptr, being_get_select_name( group ), local_being, beingstr );
            break;
        }

        case WATCH_APPEARANCE:
        {
            watch_appearance( ptr, being_get_select_name( group ), local_being, beingstr );
            break;
        }
        case WATCH_SPEECH:
        {
            watch_speech( ptr, being_get_select_name( group ), local_being, beingstr );
            break;
        }
        case WATCH_PATHOGENS:
        {
            watch_pathogen_graph( ptr, being_get_select_name( group ), local_being, beingstr );
            break;
        }
        }

        if ( watch_type != WATCH_NONE )
        {
            output_function( beingstr );
        }
    }
    being_remove_external_set( 0 );
}

function command_on_off(response) {
var _tmp = 0;
    var length;

    if ( response == 0 )
    {
        return -1;
    }

    length = io_length( response, STRING_BLOCK_SIZE );
    if ( ( io_find( response, 0, length, "off", 3 ) > -1 ) ||
            ( io_find( response, 0, length, "0", 1 ) > -1 ) ||
            ( io_find( response, 0, length, "false", 5 ) > -1 ) ||
            ( io_find( response, 0, length, "no", 2 ) > -1 ) )
    {
        return 0;
    }

    if ( ( io_find( response, 0, length, "on", 2 ) > -1 ) ||
            ( io_find( response, 0, length, "1", 1 ) > -1 ) ||
            ( io_find( response, 0, length, "true", 4 ) > -1 ) ||
            ( io_find( response, 0, length, "yes", 3 ) > -1 ) )
    {
        return 1;
    }

    return -1;
}

function command_event(ptr, response, output_function) {
var _tmp = 0;

var return_response = command_on_off( response );

    if ( ( return_response == -1 ) && response )
    {
        if ( io_find( response, 0, io_length( response, STRING_BLOCK_SIZE ), "social", 6 ) > -1 )
        {
            episodic_logging( output_function, 1 );
            output_function( "Event output for social turned on" );
        }
        return 0;
    }

    if ( return_response == 0 )
    {
        episodic_logging( 0, 0 );
        output_function( "Event output turned off" );
    }
    else
    {
        episodic_logging( output_function, 0 );
        output_function( "Event output turned on" );
    }

    output_function( "Episodic not supported in this build" );

    return 0;
}

function command_memory(ptr, response, output_function) {
var _tmp = 0;
var group =  ptr;
    var str2;
    sprintf( str2, "maximum memory %ld\nallocated memory %ld\nmaximum apes %ld",
             sim_memory_allocated( 1 ), sim_memory_allocated( 0 ), group.max );
    output_function( str2 );
    return 0;
}

function command_logging(ptr, response, output_function) {
var _tmp = 0;
var return_response = command_on_off( response );

    if ( return_response == -1 )
    {
        return 0;
    }
    if ( return_response == 0 )
    {
        nolog = 1;
        indicator_index = 0;
        watch_type = WATCH_NONE;
        output_function( "Logging turned off" );
    }
    else
    {
        nolog = 0;
        indicator_index = 1;
        output_function( "Logging turned on" );
    }
    return 0;
}

function command_compare_brain(braincode0, braincode1, block_size) {
var _tmp = 0;
var block_size_bytes = block_size * BRAINCODE_BYTES_PER_INSTRUCTION;
var loop = 0;
    while ( loop < ( BRAINCODE_SIZE - block_size_bytes ) )
    {
var loop2 = 0;
        while ( loop2 < ( BRAINCODE_SIZE - block_size_bytes ) )
        {
var block_step = 0;
            while ( block_step < block_size )
            {
                if ( braincode0[loop + block_step * BRAINCODE_BYTES_PER_INSTRUCTION] ==
                        braincode1[loop2 + block_step * BRAINCODE_BYTES_PER_INSTRUCTION] )
                {
                    block_step++;
                    if ( block_step == block_size )
                    {
                        return loop;
                    }
                }
                else
                {
                    break;
                }
            }
            loop2 += BRAINCODE_BYTES_PER_INSTRUCTION;
        }
        loop += BRAINCODE_BYTES_PER_INSTRUCTION;
    }
    return -1;
}

function command_idea(ptr, response, output_function) {
var _tmp = 0;





var min_block_size = 3;
var max_block_size = 8;
    var i, total_matches = 0, total_tests = 0;
    var histogram = new Array(5 + 1);
var group =  ptr;
    
    for ( i = 0; i <= ( max_block_size - min_block_size ); i++ )
    {
        histogram[i] = 0;
    }

    if ( group.select )
    {
var loop = 0;
        while ( loop < group.num )
        {
var local_being = ( group.beings[loop] );
var bc_external = being_braincode_external( local_being );
            if ( bc_external )
            {

var loop2 = loop + 1;
                while ( loop2 < group.num )
                {
var local_being2 = ( group.beings[loop2] );
var bc_external2 = being_braincode_external( local_being2 );

                    if ( bc_external2 )
                    {
var location = 0;
var block_size = min_block_size;

                        while ( block_size <= max_block_size )
                        {
                            location = command_compare_brain( bc_external,
                                                              bc_external2,
                                                              block_size );

                            if ( location != -1 )
                            {
                                histogram[block_size - min_block_size]++;
                                total_matches++;
                            }
                            total_tests++;
                            block_size++;
                        }
                    }
                    loop2++;
                }

            }
            loop++;
        }
    }

    if ( total_tests > 0 )
    {
        var output;

        sprintf( output, "Matches %03.%04 percent\n",
                 ( total_matches * 100 / total_tests ),
                 ( total_matches * 1000000 / total_tests ) % 10000 );
        output_function( output );


        output_function( "Block Percent   Instances" );
        output_function( "-------------------------" );

        for ( i = 0; i <= ( max_block_size - min_block_size ); i++ )
        {
            sprintf( output, "%02    %03.%04  %04",
                     ( i + min_block_size ),
                     ( histogram[i] * 100 / total_tests ),
                     ( ( histogram[i] * 1000000 / total_tests ) % 10000 ),
                     histogram[i] );
            output_function( output );
        }
    }


    return 0;
}

function command_watch(ptr, response, output_function) {
var _tmp = 0;
var group =  ptr;
    var length;
    var output;
var position = 0;

    if ( command_check_ape_present( ptr, output_function ) == 0 )
    {
        return 0;
    }

    if ( response == 0 )
    {
        return 0;
    }
    else
    {
        length = io_length( response, STRING_BLOCK_SIZE );
    }

    if ( ( length < 5 ) && ( io_find( response, 0, length, "off", 3 ) > -1 ) )
    {
        output_function( "Stopped watching" );
        watch_type = WATCH_NONE;
        return 0;
    }

    if ( ( length < 10 ) && ( io_find( response, 0, length, "state", 5 ) > -1 ) )
    {
        watch_type = WATCH_STATES;
        output_function( "Watching being states" );
        return 0;
    }

    if ( being_from_name( group, response ) != 0 )
    {
        being_set_select_name( group, response );
        io_string_write( output, "Watching ", position );
        io_string_write( output, being_get_select_name( group ), position );
        output_function( output );
        position = 0;
        watch_type = WATCH_ALL;
    }
    else
    {
        if ( group.select )
        {
            if ( io_find( response, 0, length, "braincode", 9 ) > -1 )
            {
                watch_type = WATCH_BRAINCODE;
                io_string_write( output, "Watching braincode for ", position );
                io_string_write( output, being_get_select_name( group ), position );
                output_function( output );
                return 0;
            }
            if ( ( io_find( response, 0, length, "brainprobe", 10 ) > -1 ) ||
                    ( io_find( response, 0, length, "brain probe", 11 ) > -1 ) ||
                    ( io_find( response, 0, length, "probes", 6 ) > -1 ) )
            {
                watch_type = WATCH_BRAINPROBES;
                io_string_write( output, "Watching brain probes for ", position );
                io_string_write( output, being_get_select_name( group ), position );
                output_function( output );
                return 0;
            }
            if ( ( io_find( response, 0, length, "graph", 5 ) > -1 ) ||
                    ( io_find( response, 0, length, "friend", 6 ) > -1 ) )
            {
                watch_type = WATCH_SOCIAL_GRAPH;

                io_string_write( output, "Watching social graph for ", position );
                io_string_write( output, being_get_select_name( group ), position );
                output_function( output );
                return 0;
            }
            if ( ( io_find( response, 0, length, "episodic", 8 ) > -1 ) ||
                    ( io_find( response, 0, length, "episodic memory", 15 ) > -1 ) ||
                    ( io_find( response, 0, length, "memory", 6 ) > -1 ) )
            {
                watch_type = WATCH_EPISODIC;

                io_string_write( output, "Watching episodic memory for ", position );
                io_string_write( output, being_get_select_name( group ), position );
                output_function( output );
                return 0;
            }
            if ( io_find( response, 0, length, "pathogen", 8 ) > -1 )
            {
                watch_type = WATCH_PATHOGENS;

                io_string_write( output, "Watching pathogen for ", position );
                io_string_write( output, being_get_select_name( group ), position );
                output_function( output );
                return 0;
            }
            if ( io_find( response, 0, length, "speech", 6 ) > -1 )
            {
                watch_type = WATCH_SPEECH;

                io_string_write( output, "Watching speech for ", position );
                io_string_write( output, being_get_select_name( group ), position );
                output_function( output );
                return 0;
            }
            if ( ( length < 5 ) && ( io_find( response, 0, length, "all", 3 ) > -1 ) )
            {
                watch_type = WATCH_ALL;

                io_string_write( output, "Watching ", position );
                io_string_write( output, being_get_select_name( group ), position );
                output_function( output );
                return 0;
            }

            if ( io_find( response, 0, length, "appear", 6 ) > -1 )
            {
                watch_type = WATCH_APPEARANCE;
                io_string_write( output, "Watching appearance for ", position );
                io_string_write( output, being_get_select_name( group ), position );
                output_function( output );
                return 0;
            }
        }

        output_function( "Being not found\n" );
    }
    return 0;
}

function command_interval(ptr, response, output_function) {
var _tmp = 0;
var number = { value: 1 }, interval = { value: INTERVAL_DAYS }, interval_set = 0;
    var output = new Array( STRING_BLOCK_SIZE );
    var number_string = new Array( STRING_BLOCK_SIZE );

    if ( response != 0 )
    {
        if ( io_length( response, STRING_BLOCK_SIZE ) > 0 )
        {
            if ( get_time_interval( response, number, interval ) > -1 )
            {
                if ( number.value > 0 )
                {
                    save_interval_steps = number.value * interval_steps[interval.value];
                    io_number_to_string( number_string, number.value );
                    io_three_strings( output, "Logging interval set to ", number_string, interval_description[interval.value], 0 );
                    output_function( output );
                    interval_set = 1;
                }
            }
        }
    }

    if ( interval_set == 0 )
    {
        if ( save_interval_steps < 60 )
        {
            io_number_to_string( number_string, save_interval_steps );
            io_three_strings( output, "Current time interval is ", number_string, " min(s)", 0 );
            output_function( output );
        }
        else
        {
            if ( save_interval_steps < 60 * 24 )
            {
                io_number_to_string( number_string, save_interval_steps / 60 );
                io_three_strings( output, "Current time interval is ", number_string, " hour(s)", 0 );
                output_function( output );
            }
            else
            {
                io_number_to_string( number_string, save_interval_steps / ( 60 * 24 ) );
                io_three_strings( output, "Current time interval is ", number_string, " day(s)", 0 );
                output_function( output );
            }
        }
    }
    return 0;
}

function command_stop(ptr, response, output_function) {
var _tmp = 0;
    simulation_running = 0;
    if ( output_function )
    {
        output_function( "Simulation stopped" );
    }
    return 0;
}

function command_file(ptr, response, output_function) {
var _tmp = 0;
//    io_search_file_format( simulated_file_format, response );
    return 0;
}

function command_step(ptr, response, output_function) {
var _tmp = 0;
var group =  ptr;
var loop = 0;

    if ( response != RUN_STEP_CONST )
    {
        if ( simulation_executing == 1 )
        {
            output_function( "Simulation already running" );
            return 0;
        }

        if ( command_file_interaction )
        {
            output_function( "File interaction in use: step" );
            return 0;
        }

        simulation_executing = 1;
    }
    simulation_running = 1;

    while ( ( loop < save_interval_steps ) && simulation_running )
    {
        sim_cycle();
        if ( group.num == 0 )
        {
            simulation_running = 0;
        }
        loop++;
    }
    if ( response != RUN_STEP_CONST )
    {
        watch_being( group, output_function );
    }

    if ( response != RUN_STEP_CONST )
    {
        simulation_executing = 0;
    }

    return 0;
}

function command_run(ptr, response, output_function) {
var _tmp = 0;
var run = 0;
var number = { value: 0 }, interval = { value: INTERVAL_DAYS };
var forever = 0;
    var output = new Array( STRING_BLOCK_SIZE );
    var number_string = new Array( STRING_BLOCK_SIZE );

    if ( simulation_executing == 1 )
    {
        output_function( "Simulation already running" );
        return 0;
    }

    if ( command_file_interaction )
    {
        output_function( "File interaction in use: run" );
        return 0;
    }

    simulation_executing = 1;

    simulation_running = 1;

    if ( response != 0 )
    {
var length = io_length( response, STRING_BLOCK_SIZE );
        if ( length > 0 )
        {
            if ( ( io_find( response, 0, length, "forever", 7 ) > -1 ) )
            {
                forever = 1;
var _tmp = 1;
            }
            else if ( get_time_interval( response, number, interval ) <= -1 )
            {
var _tmp = -1;
            }

            if ( number.value > 0 )
            {
var i = 0;
var end_point = ( number.value * interval_steps[interval.value] );
var temp_save_interval_steps = save_interval_steps;
var count = 0;
                save_interval_steps = 1;

                if ( forever )
                {
                    io_three_strings( output, "Running forever (type \"stop\" to end)", "", "", 0 );
                }
                else
                {
                    io_number_to_string( number_string, number.value );
                    io_three_strings( output, "Running for ", number_string, interval_description[interval.value], 0 );
                }

                output_function( output );

                while ( ( i < end_point ) && simulation_running )
                {
                    command_step( ptr, RUN_STEP_CONST, output_function );

                    if ( temp_save_interval_steps )
                    {
                        if ( ( count % temp_save_interval_steps ) == 0 )
                        {
                            watch_being( ptr, output_function );
                        }
                    }
                    count++;
                    if ( !forever )
                    {
                        i++;
                    }
                }

                if ( temp_save_interval_steps )
                {
                    if ( ( count % temp_save_interval_steps ) != 1 )
                    {
                        watch_being( ptr, output_function );
                    }
                }

                save_interval_steps = temp_save_interval_steps;
                run = 1;
            }
        }
    }

    simulation_executing = 0;

    if ( run == 0 )
    {
        SHOW_ERROR( "Time not specified, examples: run 2 days, run 6 hours" );
    }

    return 0;
}

function command_reset(ptr, response, output_function) {
var _tmp = 0;
    var seed = new Array(2);
var local_land_genetics = land_genetics();

    seed[0] = local_land_genetics[0];
    seed[1] = local_land_genetics[1];

    math_random3( seed );

    if ( sim_init( KIND_NEW_SIMULATION, ( ( seed[0] << 16 ) | seed[1] ), MAP_AREA, 0 ) )
    {
        output_function( "Simulation reset" );
        return 0;
    }
    output_function( "Simulation has not enough memory" );
    return 1;
}

function command_get_response_mode(response) {
var _tmp = 0;
    var length;
    if ( response == 0 )
    {
        return 0;
    }
    length = io_length( response, STRING_BLOCK_SIZE );
    if ( response != 0 )
    {
        
        if ( io_find( response, 0, length, "fem", 3 ) > -1 )
        {
            return 1;
        }
        
        if ( io_find( response, 0, length, "male", 4 ) > -1 )
        {
            return 2;
        }
        
        if ( ( io_find( response, 0, length, "juv", 3 ) > -1 ) ||
                ( io_find( response, 0, length, "chil", 4 ) > -1 ) )
        {
            return 3;
        }
    }
    return 0;
}

function command_save(ptr, response, output_function) {
var _tmp = 0;

    return 0;
}

function command_base_open(ptr, response, output_function, script) {
var _tmp = 0;

    return 0;
}

function command_open(ptr, response, output_function) {
var _tmp = 0;
    return command_base_open( ptr, response, output_function, 0 );
}

function command_script(ptr, response, output_function) {
var _tmp = 0;
    return command_base_open( ptr, response, output_function, 1 );
}

function command_top(ptr, response, output_function) {
var _tmp = 0;
var group =  ptr;

    var i, j;
    var k;
var max = 10;
    var eliminated;
    var current_date, local_dob, age_in_years, age_in_months, age_in_days;
    var str = new Array( STRING_BLOCK_SIZE );
    var b;
var mode = command_get_response_mode( response );

    output_function( "Honor Name                     Sex\tAge" );
    output_function( "-----------------------------------------------------------------" );

    eliminated = memory_new( group.num * sizeof("n_byte") );
    for ( i = 0; i < group.num; i++ )
    {
        eliminated[i] = 0;
    }

    if ( group.num < max )
    {
        max = group.num;
    }
    for ( i = 0; i < max; i++ )
    {
var winner = -1;
var max_honor = 0;
        var passed;
        var output_value = new Array( STRING_BLOCK_SIZE );

        for ( j = 0; j < group.num; j++ )
        {
            if ( eliminated[j] == 0 )
            {
                var honor;
                b = group.beings[j];

                honor = being_honor( b );

                if ( honor >= max_honor )
                {
                    passed = 0;
                    switch ( mode )
                    {
                    case 0:
                    {
                        passed = 1;
                        break;
                    }
                    case 1:
                    {
                        if ( FIND_SEX( GET_I( b ) ) == SEX_FEMALE )
                        {
                            passed = 1;
                        }
                        break;
                    }
                    case 2:
                    {
                        if ( FIND_SEX( GET_I( b ) ) != SEX_FEMALE )
                        {
                            passed = 1;
                        }
                        break;
                    }
                    case 3:
                    {
                        if ( AGE_IN_DAYS( b ) < AGE_OF_MATURITY )
                        {
                            passed = 1;
                        }
                        break;
                    }
                    }

                    if ( passed != 0 )
                    {
                        winner = j;
                        max_honor = honor;
                    }
                }
            }
        }

        if ( winner == -1 )
        {
            break;
        }

        eliminated[winner] = 1;
        b = group.beings[winner];

        sprintf( output_value, "%03d   ", ( being_honor( b ) ) );

        str = being_name_simple( b, str );

        io_three_strings( output_value, output_value, str, "", 0 );

        for ( k = 0; k < 25 - io_length( str, STRING_BLOCK_SIZE ); k++ )
        {
            io_three_strings( output_value, output_value, " ", "", 0 );
        }
        if ( FIND_SEX( GET_I( b ) ) == SEX_FEMALE )
        {
            io_three_strings( output_value, output_value, "Female\t", "", 0 );
        }
        else
        {
            io_three_strings( output_value, output_value, "Male\t", "", 0 );
        }

        current_date = land_date();
        local_dob = being_dob( b );
        age_in_years = AGE_IN_YEARS( b );
        age_in_months = ( ( current_date - local_dob ) - ( age_in_years * TIME_YEAR_DAYS ) ) / ( TIME_YEAR_DAYS / 12 );
        age_in_days = ( current_date - local_dob ) - ( ( TIME_YEAR_DAYS / 12 ) * age_in_months ) - ( age_in_years * TIME_YEAR_DAYS );

        if ( age_in_years > 0 )
        {
            var number;
            io_number_to_string( number, age_in_years );
            io_three_strings( output_value, output_value, number, " yrs ", 0 );
        }
        if ( age_in_months > 0 )
        {
            var number;
            io_number_to_string( number, age_in_months );
            io_three_strings( output_value, output_value, number, " mnths ", 0 );
        }
        {
            var number;
            io_number_to_string( number, age_in_days );
            io_three_strings( output_value, output_value, number, "  days", 0 );
        }
        output_function( output_value );

    }

    memory_free( eliminated );

    return 0;
}

function command_epic(ptr, response, output_function) {
var _tmp = 0;
var group =  ptr;

    var i, j, k, e;
    var local_being;
    var local_episodic;
var max = 1024;
var first_name = memory_new( max * sizeof("n_byte2") );
var family_name = memory_new( max * sizeof("n_byte2") );
var hits = memory_new( max * sizeof("n_byte2") );
    var temp;
    var name;
    var passed, mode = command_get_response_mode( response );

    
    for ( i = 0; i < max; i++ )
    {
        first_name[i] = 0;
        family_name[i] = 0;
        hits[i] = 0;
    }

    for ( i = 0; i < group.num; i++ )
    {
        
        local_being = group.beings[i];

        
        local_episodic = being_episodic( local_being );

        
        if ( local_episodic == 0 )
        {
            continue;
        }

        
        for ( e = 0; e < EPISODIC_SIZE; e++ )
        {
            
            if ( local_episodic[e].event > 0 )
            {
                
                for ( j = BEING_MEETER; j <= BEING_MET; j++ )
                {
                    
                    if ( local_episodic[e].first_name[j] +
                            local_episodic[e].family_name[j] > 0 )
                    {
                        passed = 0;
                        switch ( mode )
                        {
                        case 0:
                        {
                            passed = 1;
                            break;
                        }
                        case 1:
                        {
                            if ( ( local_episodic[e].first_name[j] >> 8 ) == SEX_FEMALE )
                            {
                                passed = 1;
                            }
                            break;
                        }
                        case 2:
                        {
                            if ( ( local_episodic[e].first_name[j] >> 8 ) != SEX_FEMALE )
                            {
                                passed = 1;
                            }
                            break;
                        }
                        case 3:
                        {
var b = 0;
                            var name;

                            being_name_byte2( local_episodic[e].first_name[j], local_episodic[e].family_name[j], name );

                            b = being_from_name( group, name );
                            if ( b != 0 )
                            {
                                if ( AGE_IN_DAYS( b ) < AGE_OF_MATURITY )
                                {
                                    passed = 1;
                                }
                            }
                            break;
                        }
                        }

                        if ( passed != 0 )
                        {
                            

                            if ( being_name_comparison( local_being, local_episodic[e].first_name[j], local_episodic[e].family_name[j] ) )
                            {
                                if ( ( ( j == BEING_MET ) &&
                                        ( local_episodic[e].event != EVENT_SEEK_MATE ) &&
                                        ( local_episodic[e].event != EVENT_EAT ) ) ||
                                        ( j == BEING_MEETER ) )
                                {
                                    
                                    for ( k = 0; k < max; k++ )
                                    {
                                        if ( hits[k] == 0 ) 
                                        {
                                            first_name[k] = local_episodic[e].first_name[j];
                                            family_name[k] = local_episodic[e].family_name[j];
                                            break;
                                        }
                                        if ( first_name[k] == local_episodic[e].first_name[j] )
                                        {
                                            if ( family_name[k] == local_episodic[e].family_name[j] )
                                            {
                                                
                                                break;
                                            }
                                        }
                                    }
                                    
                                    if ( k < max )
                                    {
                                        hits[k]++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    
    for ( i = 0; i < 10; i++ )
    {
        
        for ( j = i + 1; j < max; j++ )
        {
            if ( hits[j] == 0 )
            {
                break;    
            }
            if ( hits[j] > hits[i] )
            {
                
                temp = first_name[j];
                first_name[j] = first_name[i];
                first_name[i] = temp;

                temp = family_name[j];
                family_name[j] = family_name[i];
                family_name[i] = temp;

                temp = hits[j];
                hits[j] = hits[i];
                hits[i] = temp;
            }
        }
        if ( hits[i] > 0 )
        {
            var output_value;
            being_name_byte2( first_name[i], family_name[i], name );

            sprintf( output_value, "%06d %s", hits[i], name );
            output_function( output_value );
        }
    }

    
    memory_free( first_name );
    memory_free( family_name );
    memory_free( hits );

    return 0;
}

function command_quit(ptr, response, output_function) {
var _tmp = 0;
    simulation_executing = 0;

    command_stop( ptr, response, output_function );
    return io_quit( ptr, response, output_function );
}

var control_commands = [
    { function_: io_help, command: "help", addition: "[(command)]", help_information: "Displays a list of all the commands" },
    { function_: command_reset, command: "reset", addition: "", help_information: "Reset the simulation" },
    { function_: command_reset, command: "clear", addition: "", help_information: "" },
    { function_: command_open, command: "open", addition: "[file]", help_information: "Load a simulation file" },
    { function_: command_open, command: "load", addition: "", help_information: "" },
    { function_: command_script, command: "script", addition: "[file]", help_information: "Load an ApeScript simulation file" },
    { function_: command_save, command: "save", addition: "[file]", help_information: "Save a simulation file" },
    { function_: command_quit, command: "quit", addition: "", help_information: "Quits the console" },
    { function_: command_quit, command: "exit", addition: "", help_information: "" },
    { function_: command_quit, command: "close", addition: "", help_information: "" },
    { function_: command_stop, command: "stop", addition: "", help_information: "Stop the simulation during step or run" },
    { function_: command_file, command: "file", addition: "[(component)]", help_information: "Information on the file format" },
    { function_: command_run, command: "run", addition: "(time format)|forever", help_information: "Simulate for a given number of days or forever" },
    { function_: command_step, command: "step", addition: "", help_information: "Run for a single logging interval" },
    { function_: command_top, command: "top", addition: "", help_information: "List the top apes" },
    { function_: command_epic, command: "epic", addition: "", help_information: "List the most talked about apes" },
    { function_: command_interval, command: "interval", addition: "(days)", help_information: "Set the simulation logging interval in days" },
    { function_: command_event, command: "event", addition: "on|social|off", help_information: "Episodic events (all) on, social on or all off" },
    { function_: command_logging, command: "logging", addition: "on|off", help_information: "Turn logging of images and data on or off" },
    { function_: command_logging, command: "log", addition: "", help_information: "" },
    { function_: command_simulation, command: "simulation", addition: "", help_information: "" },
    { function_: command_simulation, command: "sim", addition: "", help_information: "Show simulation parameters" },
    { function_: command_watch, command: "watch", addition: "(ape name)|all|off|*", help_information: "Watch (specific *) for the current ape" },
    { function_: command_watch, command: "monitor", addition: "", help_information: "" },
    { function_: command_idea, command: "idea", addition: "", help_information: "Track shared braincode between apes" },
    { function_: command_being, command: "ape", addition: "", help_information: "Name of the currently watched ape" },
    { function_: command_being, command: "pwd", addition: "", help_information: "" },
    { function_: command_pathogen_graph, command: "pathogen", addition: "(ape name)", help_information: "* Show pathogens for a named ape" },
    { function_: command_social_graph, command: "friends", addition: "", help_information: "" },
    { function_: command_social_graph, command: "social", addition: "", help_information: "" },
    { function_: command_social_graph, command: "socialgraph", addition: "", help_information: "" },
    { function_: command_social_graph, command: "graph", addition: "(ape name)", help_information: "* Show social graph for a named ape" },
    { function_: command_braincode, command: "braincode", addition: "(ape name)", help_information: "* Show braincode for a named ape" },
    { function_: command_speech, command: "speech", addition: "(ape name)", help_information: "* Show speech for a named ape" },
    { function_: command_episodic, command: "episodic", addition: "(ape name)", help_information: "* Show episodic memory for a named ape" },
    { function_: command_probes, command: "probes", addition: "(ape name)", help_information: "* Show brain probes for a named ape" },
    { function_: command_stats, command: "stats", addition: "(ape name)", help_information: "* Show parameters for a named ape" },
    { function_: command_stats, command: "status", addition: "", help_information: "" },
    { function_: command_appearance, command: "appearance", addition: "(ape name)", help_information: "* Show appearance values for a named ape" },
    { function_: command_appearance, command: "physical", addition: "", help_information: "" },
    { function_: command_genome, command: "genome", addition: "(ape name)", help_information: "Show genome for a named ape" },
    { function_: command_genome, command: "genetics", addition: "", help_information: "" },
    { function_: command_list, command: "list", addition: "", help_information: "List all ape names" },
    { function_: command_list, command: "ls", addition: "", help_information: "" },
    { function_: command_list, command: "dir", addition: "", help_information: "" },
    { function_: command_next, command: "next", addition: "", help_information: "Next ape" },
    { function_: command_previous, command: "previous", addition: "", help_information: "Previous ape" },
    { function_: command_previous, command: "prev", addition: "", help_information: "" },
    { function_: command_memory, command: "memory", addition: "", help_information: "Memory information for the simulation" },
    { function_: 0, command: 0, addition: 0, help_information: 0 },
];
