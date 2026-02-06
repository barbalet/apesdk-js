
/****************************************************************

 sim.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var CONSOLE_REQUIRED = null;
var CONSOLE_ONLY = null;
var offbuffer = 0;
var MIN_BEINGS = 4;
var group;
var timing;
var sim_new_progress = 0;
var sim_new_run = 0;
var initial_memory_allocated;
var sim_desire_output = 0;
var sim_writing_output = 0;
var sim_console_output;
var sim_quit_value = 0;
var threads = [0, 0];
var threads_running = [[0], [0]];
var input_function = io_console_entry_clean;
var output_function = io_console_out;
var MAX_POSSIBLE_CONTROL_CHARACTER_X = null;
var MAX_POSSIBLE_CONTROL_CHARACTER_Y = null;
var sim_control_string = new Array(255 * 40);
var sim_control_string_offset = new Array(255);
var sim_control = new Array(MAX_POSSIBLE_CONTROL_CHARACTER_X * MAX_POSSIBLE_CONTROL_CHARACTER_Y);
var sim_control_max_x;
var sim_control_previous_character;
var sim_control_character_location;
var PROCESSING_HEAVY_WEIGHT = (4);
var PROCESSING_MIDDLE_WEIGHT = (8);
var PROCESSING_WELTER_WEIGHT = (16);
var PROCESSING_LIGHT_WEIGHT = (32);
var PROCESSING_FEATHER_WEIGHT = (64);
var PROCESSING_HEAVY_WEIGHT = (3);
var PROCESSING_MIDDLE_WEIGHT = (7);
var PROCESSING_WELTER_WEIGHT = (17);
var PROCESSING_LIGHT_WEIGHT = (31);
var PROCESSING_FEATHER_WEIGHT = (67);
var local_execution = KIND_PRE_STARTUP;
var MINIMAL_ALLOCATION = null;
var MAXIMUM_ALLOCATION = null;

function array_of(length, factory, fill_value) {
var _tmp = 0;
    var count = length || 0;
    var result = new Array( count );
    var i = 0;
    if ( factory )
    {
        while ( i < count )
        {
            result[i] = factory();
            i++;
        }
    }
    else
    {
        while ( i < count )
        {
            result[i] = fill_value;
            i++;
        }
    }
    return result;
}

function create_spacetime() {
var _tmp = 0;
    return { location: [0, 0], time: 0, date: 0 };
}

function create_feature() {
var _tmp = 0;
    return { value: 0, frequency: 0, type: 0 };
}

function create_featureset() {
var _tmp = 0;
var size = ( typeof MAX_FEATURESET_SIZE !== "undefined" && MAX_FEATURESET_SIZE ) ? MAX_FEATURESET_SIZE : 0;
    return {
        feature_number: 0,
        features: array_of( size, create_feature ),
        observations: 0
    };
}

function create_social_entry() {
var _tmp = 0;
var braincode_size = ( typeof BRAINCODE_SIZE !== "undefined" && BRAINCODE_SIZE ) ? BRAINCODE_SIZE : 0;
    return {
        space_time: create_spacetime(),
        first_name: [0, 0],
        family_name: [0, 0],
        attraction: 0,
        friend_foe: 0,
        belief: 0,
        familiarity: 0,
        relationship: 0,
        entity_type: 0,
        classification: create_featureset(),
        braincode: array_of( braincode_size, 0, 0 )
    };
}

function create_episodic_entry() {
var _tmp = 0;
    return {
        space_time: create_spacetime(),
        first_name: [0, 0],
        family_name: [0, 0],
        event: 0,
        food: 0,
        affect: 0,
        arg: 0
    };
}

function create_place_entry() {
var _tmp = 0;
    return { name: 0, familiarity: 0 };
}

function create_brain_probe() {
var _tmp = 0;
    return { type: 0, position: 0, address: 0, frequency: 0, offset: 0, state: 0 };
}

function create_immune_system() {
var _tmp = 0;
var antigen_count = ( typeof IMMUNE_ANTIGENS !== "undefined" && IMMUNE_ANTIGENS ) ? IMMUNE_ANTIGENS : 0;
var population = ( typeof IMMUNE_POPULATION !== "undefined" && IMMUNE_POPULATION ) ? IMMUNE_POPULATION : 0;
    return {
        antigens: array_of( antigen_count, 0, 0 ),
        shape_antigen: array_of( antigen_count, 0, 0 ),
        antibodies: array_of( population, 0, 0 ),
        shape_antibody: array_of( population, 0, 0 ),
        random_seed: [0, 0]
    };
}

function create_being() {
var _tmp = 0;
var drives_count = ( typeof DRIVES !== "undefined" && DRIVES ) ? DRIVES : 0;
var shout_count = ( typeof SHOUT_BYTES !== "undefined" && SHOUT_BYTES ) ? SHOUT_BYTES : 0;
var inventory_count = ( typeof INVENTORY_SIZE !== "undefined" && INVENTORY_SIZE ) ? INVENTORY_SIZE : 0;
var preferences_count = ( typeof PREFERENCES !== "undefined" && PREFERENCES ) ? PREFERENCES : 0;
var chromosomes = ( typeof CHROMOSOMES !== "undefined" && CHROMOSOMES ) ? CHROMOSOMES : 0;
var social_size = ( typeof SOCIAL_SIZE !== "undefined" && SOCIAL_SIZE ) ? SOCIAL_SIZE : 0;
var episodic_size = ( typeof EPISODIC_SIZE !== "undefined" && EPISODIC_SIZE ) ? EPISODIC_SIZE : 0;
var territory_dim = ( typeof TERRITORY_DIMENSION !== "undefined" && TERRITORY_DIMENSION ) ? TERRITORY_DIMENSION : 0;
var territory_size = territory_dim * territory_dim;
var attention_size = ( typeof ATTENTION_SIZE !== "undefined" && ATTENTION_SIZE ) ? ATTENTION_SIZE : 0;
var brain_registers = ( typeof BRAINCODE_PSPACE_REGISTERS !== "undefined" && BRAINCODE_PSPACE_REGISTERS ) ? BRAINCODE_PSPACE_REGISTERS : 0;
var brain_probes = ( typeof BRAINCODE_PROBES !== "undefined" && BRAINCODE_PROBES ) ? BRAINCODE_PROBES : 0;

    return {
        delta: {
            location: [0, 0],
            direction_facing: 0,
            velocity: array_of( 10, 0, 0 ),
            stored_energy: 0,
            random_seed: [0, 0],
            macro_state: 0,
            parasites: 0,
            honor: 0,
            crowding: 0,
            height: 0,
            mass: 0,
            posture: 0,
            goal: array_of( 4, 0, 0 ),
            social_coord_x: 0,
            social_coord_y: 0,
            social_coord_nx: 0,
            social_coord_ny: 0,
            awake: 0,
            total_movement: 0
        },
        constant: {
            date_of_birth: 0,
            generation_min: 0,
            generation_max: 0,
            name: [0, 0],
            genetics: array_of( chromosomes, 0, 0 )
        },
        events: {
            social: array_of( social_size, create_social_entry ),
            episodic: array_of( episodic_size, create_episodic_entry ),
            territory: array_of( territory_size, create_place_entry )
        },
        braindata: {
            braincode_register: array_of( brain_registers, 0, 0 ),
            brainprobe: array_of( brain_probes, create_brain_probe ),
            brain_state: array_of( 6, 0, 0 ),
            script_overrides: 0,
            attention: array_of( attention_size, 0, 0 )
        },
        changes: {
            drives: array_of( drives_count, 0, 0 ),
            shout: array_of( shout_count, 0, 0 ),
            inventory: array_of( inventory_count, 0, 0 ),
            learned_preference: array_of( preferences_count, 0, 0 ),
            date_of_conception: 0,
            fetal_genetics: array_of( chromosomes, 0, 0 ),
            father_name: [0, 0],
            mother_name: [0, 0],
            child_generation_min: 0,
            child_generation_max: 0
        },
        immune_system: create_immune_system()
    };
}

function create_remains() {
var _tmp = 0;
var bodies_count = ( typeof NUMBER_OF_BODIES !== "undefined" && NUMBER_OF_BODIES ) ? NUMBER_OF_BODIES : 0;
    return {
        bodies: array_of( bodies_count, () => ({ location: [0, 0] }) ),
        count: 0,
        location: 0
    };
}

function create_group() {
var _tmp = 0;
var max_beings = ( typeof LARGE_SIM !== "undefined" && LARGE_SIM ) ? LARGE_SIM : 0;
    return {
        beings: array_of( max_beings, create_being ),
        remains: create_remains(),
        select: 0,
        ext_birth: 0,
        ext_death: 0,
        num: 0,
        max: max_beings
    };
}

function create_timing() {
var _tmp = 0;
    return {
        real_time: 0,
        last_time: 0,
        delta_cycles: 0,
        count_cycles: 0,
        delta_frames: 0,
        count_frames: 0
    };
}

group = create_group();
timing = create_timing();
sim_console_output = new Array( ( typeof STRING_BLOCK_SIZE !== "undefined" && STRING_BLOCK_SIZE ) ? STRING_BLOCK_SIZE : 4096 );

function sim_thread_console_quit() {
var _tmp = 0;
    return sim_quit_value;
}

function sim_new_run_condition() {
var _tmp = 0;
    return sim_new_run;
}

function sim_console_clean_up() {
var _tmp = 0;
    if ( ( io_command_line_execution() == 0 ) || sim_quit_value )
    {
        return;
    }

    sim_quit_value = 1;

    command_quit( 0, 0, 0 );

    while ( command_executing() ) {}
}

function sim_set_console_input(local_input_function) {
var _tmp = 0;
    if ( local_input_function != 0 )
    {
        input_function = local_input_function;
    }
}

function sim_set_console_output(local_output_function) {
var _tmp = 0;
    if ( local_output_function != 0 )
    {
        output_function = local_output_function;
    }
}

function sim_thread_posix(threadid) {
var _tmp = 0;
var local = threadid;
    if ( io_console( group,  control_commands, input_function, output_function ) != 0 )
    {
        sim_console_clean_up();
    }
    local[0] = 0;
    pthread_exit( 0 );
}

function sim_thread_console() {
var _tmp = 0;
    if ( io_command_line_execution() == 0 )
    {
        return;
    }

    if ( ( threads_running[0][0] == 0 ) || ( threads_running[1][0] == 0 ) )
    {
var loop = 0;
        while ( loop < 2 )
        {
            if ( threads_running[loop][0] == 0 )
            {
                threads_running[loop][0] = 1;
                pthread_create( threads[loop], 0, sim_thread_posix, threads_running[loop] );
                return;
            }
            loop++;
        }
    }
}

function sim_console(simulation_filename, randomise) {
var _tmp = 0;
    printf( "\n *** %sConsole, %s ***\n", SHORT_VERSION_NAME, FULL_DATE );
    printf( "      For a list of commands type 'help'\n\n" );

    io_command_line_execution_set();
    sim_init( KIND_START_UP, randomise, MAP_AREA, 0 );


    do
    {
        sim_thread_console();
    }
    while ( sim_thread_console_quit() == 0 );

    {
        do
        {}
        while ( io_console( group,
                            control_commands,
                            io_console_entry,
                            io_console_out ) == 0 );
    }

    sim_close();
}

function sim_set_output(value) {
var _tmp = 0;
    sim_desire_output = value;
}

function sim_get_writing_output() {
var _tmp = 0;
    return sim_writing_output;
}

function sim_output_string() {
var _tmp = 0;
    return sim_console_output;
}

function sim_new() {
var _tmp = 0;
    return sim_new_progress;
}

function sim_realtime(time) {
var _tmp = 0;
    timing.real_time = time;
}

function sim_being_local() {
var _tmp = 0;
var group = sim_group();

    if ( group == 0 )
    {
        return 0;
    }

    return group.select;
}

function sim_move(rel_vel, kind) {
var _tmp = 0;
    var local;
    if ( ( local = sim_being_local() ) )
    {
        being_move( local, rel_vel, kind );
    }
}

function sim_view_options(px, py) {
var _tmp = 0;
    var local;
    if ( ( local = sim_being_local() ) )
    {
        var location = new Array(2);

        location[0] = APESPACE_CONFINED( MAPSPACE_TO_APESPACE( px ) );
        location[1] = APESPACE_CONFINED( MAPSPACE_TO_APESPACE( py ) );

        being_set_location( local, location );
    }
}

function sim_timing() {
var _tmp = 0;
    return timing;
}

function sim_group() {
var _tmp = 0;
    return group;
}

function sim_control_translate(px, py) {
var _tmp = 0;
var character_x = ( px - CHARACTER_WIDTH ) / CHARACTER_WIDTH;
    if ( ( character_x > -1 ) && ( character_x < MAX_POSSIBLE_CONTROL_CHARACTER_X ) )
    {
        var character_y = ( py - CHARACTER_WIDTH ) / CHARACTER_HEIGHT;
        if ( ( character_y > -1 ) && ( character_y < MAX_POSSIBLE_CONTROL_CHARACTER_Y ) )
        {
            return { x: character_x, y: character_y };
        }
    }
    return 0;
}

function sim_control_set(px, py, value, character) {
var _tmp = 0;
    var character_x, character_y;
    var coords = sim_control_translate( px, py );
    if ( coords )
    {
        character_x = coords.x;
        character_y = coords.y;
        sim_control[( character_y * sim_control_max_x ) + character_x] = value;
        if ( value != sim_control_previous_character )
        {
            if ( sim_control_previous_character )
            {
                sim_control_string[sim_control_character_location] = 0;
                sim_control_character_location++;
            }
            sim_control_string_offset[sim_control_previous_character] = sim_control_character_location;
            sim_control_previous_character = value;
        }
        sim_control_string[sim_control_character_location] = character;
        sim_control_character_location++;
    }
}

function sim_control_erase(size_x, size_y, max_characters) {
var _tmp = 0;
var max_y = ( size_y - CHARACTER_WIDTH ) / CHARACTER_HEIGHT;
    sim_control_max_x = max_characters;
    sim_control_previous_character = 0;
    sim_control_character_location = 0;
    memory_erase( sim_control, ( sim_control_max_x * max_y ) );
    memory_erase( sim_control_string, 255 * 40 );
}

function sim_select_name(name) {
var _tmp = 0;
var name_hash = math_hash( name, io_length( name, STRING_BLOCK_SIZE ) );
var loop = 0;
var group = sim_group();
var local_beings = group.beings;
    while ( loop < group.num )
    {
        var being_hash;
var local_being = local_beings[loop];
        var local_name = new Array( STRING_BLOCK_SIZE );
        local_name = being_name_simple( local_being, local_name );
        being_hash = math_hash( local_name, io_length( local_name, STRING_BLOCK_SIZE ) );
        if ( name_hash == being_hash )
        {
            return local_being;
        }
        loop++;
    }
    return 0;
}

function sim_control_debug_sim_control(py) {
var _tmp = 0;
var y_loop = 0;
    while ( y_loop < py )
    {
var x_loop = 0;
        while ( x_loop < sim_control_max_x )
        {
            printf( "%d,", sim_control[x_loop + ( y_loop * sim_control_max_x )] );
            x_loop++;
        }
        printf( "\n" );
        y_loop++;
    }
}

function sim_control_regular(px, py) {
var _tmp = 0;
    var character_x, character_y;
    var coords = sim_control_translate( px, py );
    if ( coords )
    {
        character_x = coords.x;
        character_y = coords.y;
var value = sim_control[( character_y * sim_control_max_x ) + character_x];

        printf( "p(%ld, %ld) c(%ld, %ld) sim_control_max_x %ld value %d\n", px, py, character_x, character_y, sim_control_max_x, value );
        sim_control_debug_sim_control( character_y );

        if ( value )
        {
var offset = sim_control_string_offset[value - 1];
var contral_name = sim_control_string[offset];
var select_being = sim_select_name( contral_name );
            if ( select_being )
            {
                sim_set_select( select_being );
            }
        }
    }
}

function sim_view_regular(px, py) {
var _tmp = 0;
    var local;
    if ( ( local = sim_being_local() ) )
    {
var group = sim_group();
var desired_ape = local;
var high_squ = 31;
var loop = 0;

        while ( loop < group.num )
        {
var current_ape = ( group.beings[loop] );

var screen_x = APESPACE_TO_MAPSPACE( being_location_x( current_ape ) ) - px;
var screen_y = APESPACE_TO_MAPSPACE( being_location_y( current_ape ) ) - py;
var current_squ = ( ( screen_x * screen_x ) + ( screen_y * screen_y ) );

            if ( high_squ > current_squ )
            {
                high_squ = current_squ;
                desired_ape = current_ape;
            }
            loop++;
        }

        if ( local != desired_ape )
        {
            sim_set_select( desired_ape );
            return 0;
        }
        return 1;
    }
    return 0;
}

function sim_terrain(sx) {
var _tmp = 0;
    var local;
    if ( sx > 0 )
    {
        if ( ( local = sim_being_local() ) )
        {
            being_wander( local, 1 );
        }
    }
    if ( sx <= 0 )
    {
        if ( ( local = sim_being_local() ) )
        {
            being_wander( local, -1 );
        }
    }
}

function sim_rotate(integer_rotation_256) {
var _tmp = 0;
    var local;
    if ( ( local = sim_being_local() ) )
    {
        being_wander( local, integer_rotation_256 );
    }
}

function sim_change_selected(forwards) {
var _tmp = 0;
var group = sim_group();
    if ( group )
    {
        command_change_selected( group, forwards );
    }
}

function sim_input(vcode, kind, value) {
var _tmp = 0;
var code = vcode;
var local_vr = code.variable_references;
var local_being = 0;
var temp_select = local_vr[ VARIABLE_SELECT_BEING - VARIABLE_VECT_ANGLE ];

    if ( temp_select < 0 )
    {
        return APESCRIPT_ERROR( code, AE_SELECTED_ENTITY_OUT_OF_RANGE );
    }
    {
var local_select = temp_select;
var group = sim_group();

        if ( local_select >= group.num )
        {
            return APESCRIPT_ERROR( code, AE_SELECTED_ENTITY_OUT_OF_RANGE );
        }
        local_being = ( group.beings[local_select] );
    }

    switch ( kind )
    {
    case VARIABLE_BRAIN_VALUE:
    {
        return 0;
    }

    case VARIABLE_HONOR:
        local_being.delta.honor =  value;
        break;
    case VARIABLE_PARASITES:
        being_set_parasites( local_being,  value );
        break;
    case VARIABLE_HEIGHT:
        being_set_height( local_being, value );
        break;


    case VARIABLE_FAMILY_NAME_ONE:
        being_set_family_name( local_being,
                               UNPACK_FAMILY_FIRST_NAME(  value ),
                               UNPACK_FAMILY_SECOND_NAME( being_family_name( local_being ) ) );
        break;
    case VARIABLE_FAMILY_NAME_TWO:
        being_set_family_name( local_being,
                               UNPACK_FAMILY_FIRST_NAME( being_family_name( local_being ) ),
                               UNPACK_FAMILY_SECOND_NAME(  value ) );
        break;

    case VARIABLE_GOAL_TYPE:
        local_being.delta.goal[0] =  ( value % 3 );
        break;
    case VARIABLE_GOAL_X:
        local_being.delta.goal[1] =  value;
        break;
    case VARIABLE_GOAL_Y:
        local_being.delta.goal[2] =  value;
        break;
    case VARIABLE_POSTURE:
        being_set_posture( local_being,  value );
        break;

    case VARIABLE_DRIVE_HUNGER:
        local_being.changes.drives[DRIVE_HUNGER] =  value;
        break;
    case VARIABLE_DRIVE_SOCIAL:
        local_being.changes.drives[DRIVE_SOCIAL] =  value;
        break;
    case VARIABLE_DRIVE_FATIGUE:
        local_being.changes.drives[DRIVE_FATIGUE] =  value;
        break;
    case VARIABLE_DRIVE_SEX:
        local_being.changes.drives[DRIVE_SEX] =  value;
        break;

    case VARIABLE_PREFERENCE_MATE_HEIGHT_MALE:
        local_being.changes.learned_preference[PREFERENCE_MATE_HEIGHT_MALE] =  value;
        break;
    case VARIABLE_PREFERENCE_MATE_HEIGHT_FEMALE:
        local_being.changes.learned_preference[PREFERENCE_MATE_HEIGHT_FEMALE] =  value;
        break;
    case VARIABLE_PREFERENCE_MATE_PIGMENTATION_MALE:
        local_being.changes.learned_preference[PREFERENCE_MATE_PIGMENTATION_MALE] =  value;
        break;
    case VARIABLE_PREFERENCE_MATE_PIGMENTATION_FEMALE:
        local_being.changes.learned_preference[PREFERENCE_MATE_PIGMENTATION_FEMALE] =  value;
        break;
    case VARIABLE_PREFERENCE_MATE_HAIR_MALE:
        local_being.changes.learned_preference[PREFERENCE_MATE_HAIR_MALE] =  value;
        break;
    case VARIABLE_PREFERENCE_MATE_HAIR_FEMALE:
        local_being.changes.learned_preference[PREFERENCE_MATE_HAIR_FEMALE] =  value;
        break;
    case VARIABLE_PREFERENCE_MATE_FRAME_MALE:
        local_being.changes.learned_preference[PREFERENCE_MATE_FRAME_MALE] =  value;
        break;
    case VARIABLE_PREFERENCE_MATE_FRAME_FEMALE:
        local_being.changes.learned_preference[PREFERENCE_MATE_FRAME_FEMALE] =  value;
        break;
    case VARIABLE_PREFERENCE_GROOM_MALE:
        local_being.changes.learned_preference[PREFERENCE_GROOM_MALE] =  value;
        break;
    case VARIABLE_PREFERENCE_GROOM_FEMALE:
        local_being.changes.learned_preference[PREFERENCE_GROOM_FEMALE] =  value;
        break;
    case VARIABLE_PREFERENCE_ANECDOTE_EVENT_MUTATION:
        local_being.changes.learned_preference[PREFERENCE_ANECDOTE_EVENT_MUTATION] =  value;
        break;
    case VARIABLE_PREFERENCE_ANECDOTE_AFFECT_MUTATION:
        local_being.changes.learned_preference[PREFERENCE_ANECDOTE_AFFECT_MUTATION] =  value;
        break;
    case VARIABLE_PREFERENCE_CHAT:
        local_being.changes.learned_preference[PREFERENCE_CHAT] =  value;
        break;
    case VARIABLE_ATTENTION_ACTOR_INDEX:
        being_set_attention( local_being, ATTENTION_ACTOR, value % SOCIAL_SIZE );
        break;
    case VARIABLE_ATTENTION_EPISODE_INDEX:
        being_set_attention( local_being, ATTENTION_EPISODE, value % EPISODIC_SIZE );
        break;
    case VARIABLE_ATTENTION_BODY_INDEX:
        being_set_attention( local_being, ATTENTION_BODY, value % INVENTORY_SIZE );
        break;
    }

    if ( kind > VARIABLE_BRAIN_VALUE )
    {
        local_vr[kind - VARIABLE_VECT_ANGLE] = value;
        return 0;
    }
    return -1; 
}

function sim_output(vcode, vindividual, kind, number) {
var _tmp = 0;
var group = sim_group();

var code =  vcode;
var individual =  vindividual;
var first_value = kind[0];
var second_value = kind[1];
    function set_number(target, value) {
        if ( target && ( typeof target === "object" ) )
        {
            if ( Array.isArray( target ) )
            {
                target[0] = value;
            }
            else
            {
                target.value = value;
            }
        }
        return value;
    }
    if ( first_value == APESCRIPT_NUMBER )
    {
        set_number( number, code.number_buffer[second_value] );
        return 0;
    }
    if ( ( first_value == APESCRIPT_TEXT ) && ( VARIABLE_SPECIAL( second_value, code ) == 0 ) )
    {
var local_vr = individual.variable_references;

        if ( ( second_value >= VARIABLE_BIOLOGY_AREA ) && ( second_value <= VARIABLE_BIOLOGY_EAGLE ) )
        {
            set_number( number, second_value - VARIABLE_BIOLOGY_AREA );
            return 0;
        }

        if ( second_value > VARIABLE_BRAIN_VALUE )
        {
            set_number( number, local_vr[ second_value - VARIABLE_VECT_ANGLE ] );
            return 0;
        }

        {
var local_current = individual.interpret_data;
var local_number = 0;
            var local_vector = vect2_new();
            vect2_direction( local_vector, local_vr[0], 32 );
            switch ( second_value )
            {

            case VARIABLE_VECT_X:
                local_number = local_vector.x;
                break;

            case VARIABLE_VECT_Y:
                local_number = local_vector.y;
                break;
            case VARIABLE_RANDOM:
                local_number = being_random( local_current );
                break;
            case VARIABLE_WATER_LEVEL:
                local_number = land_tide_level();
                break;
            case VARIABLE_HUNGRY:
                local_number = BEING_HUNGRY;
                break;
            case VARIABLE_ENERGY:
            {
var local_being = individual.interpret_data;
                local_number = being_energy( local_being );
            }
            break;
            case VARIABLE_LOCATION_Z:
            case VARIABLE_TEST_Z:
            case VARIABLE_IS_VISIBLE:
            case VARIABLE_BIOLOGY_OUTPUT:
            {
                var quick_x;
                var quick_y;

                if ( second_value == VARIABLE_LOCATION_Z )
                {
                    quick_x = being_location_x( local_current );
                    quick_y = being_location_y( local_current );
                }
                else
                {
                    quick_x = local_vr[VARIABLE_TEST_X - VARIABLE_VECT_ANGLE];
                    quick_y = local_vr[VARIABLE_TEST_Y - VARIABLE_VECT_ANGLE];
                    if ( ( quick_x < 0 ) || ( quick_y < 0 ) ||
                            ( quick_x > APESPACE_BOUNDS ) || ( quick_y > APESPACE_BOUNDS ) )
                    {
                        return APESCRIPT_ERROR( individual, AE_COORDINATES_OUT_OF_RANGE );
                    }
                }

                if ( second_value == VARIABLE_IS_VISIBLE )
                {
                    
var local_being = individual.interpret_data;
                    var location = vect2_new();
                    location.x = quick_x;
                    location.y = quick_y;
                    local_number = being_line_of_sight( local_being, location );
                }
                else
                {
                    if ( second_value == VARIABLE_BIOLOGY_OUTPUT )
                    {
var int_qu_op = local_vr[VARIABLE_BIOLOGY_OPERATOR - VARIABLE_VECT_ANGLE];
                        if ( ( int_qu_op < 0 ) || ( int_qu_op > ( VARIABLE_BIOLOGY_EAGLE - VARIABLE_BIOLOGY_AREA ) ) )
                        {
                            return APESCRIPT_ERROR( individual, AE_VALUE_OUT_OF_RANGE );
                        }
                        local_number = land_operator_interpolated(
                                           quick_x, quick_y, operators[int_qu_op - VARIABLE_BIOLOGY_AREA] );
                    }
                    else
                    {
                        local_number = land_location( quick_x, quick_y );
                    }
                }
            }
            break;

            case VARIABLE_TIME:
                local_number = land_time();
                break;
            case VARIABLE_DATE:
                local_number = land_date();
                break;
            case VARIABLE_CURRENT_BEING:
                local_number = being_index( group, individual.interpret_data );
                break;
            case VARIABLE_NUMBER_BEINGS:
                local_number = group.num;
                break;

            case VARIABLE_IS_ERROR:
                local_number = -1;
                break;

            case VARIABLE_WEATHER:
            {
                var quick_x;
                var quick_y;

                quick_x = local_vr[VARIABLE_TEST_X - VARIABLE_VECT_ANGLE];
                quick_y = local_vr[VARIABLE_TEST_Y - VARIABLE_VECT_ANGLE];
                if ( ( quick_x < 0 ) || ( quick_y < 0 ) ||
                        ( quick_x > APESPACE_BOUNDS ) || ( quick_y > APESPACE_BOUNDS ) )
                {
                    return APESCRIPT_ERROR( individual, AE_COORDINATES_OUT_OF_RANGE );
                }

                local_number = weather_seven_values( quick_x, quick_y );
            }
            break;
            case VARIABLE_BRAIN_VALUE:
            {
            }
            break;
            default:
            {
var temp_select = local_vr[ VARIABLE_SELECT_BEING - VARIABLE_VECT_ANGLE ];
var local_being = 0;
var local_social_graph = 0;
                var social_graph = {
                    space_time: { location: [0, 0], time: 0, date: 0 },
                    attraction: 0,
                    friend_foe: 0,
                    familiarity: 0,
                    first_name: [],
                    family_name: []
                };
                var location_vect = vect2_new();

var local_episodic = 0;
                var episodic = {
                    space_time: { location: [0, 0], time: 0, date: 0 },
                    first_name: [],
                    family_name: [],
                    event: 0,
                    affect: 0
                };


                if ( temp_select < 0 )
                {
                    return APESCRIPT_ERROR( individual, AE_SELECTED_ENTITY_OUT_OF_RANGE );
                }
                {
var local_select = temp_select;
                    if ( local_select >= group.num )
                    {
                        return APESCRIPT_ERROR( individual, AE_SELECTED_ENTITY_OUT_OF_RANGE );
                    }
                    local_being = ( group.beings[local_select] );
                    if ( local_being != 0 )
                    {
                        local_social_graph = being_social( local_being );
                        if ( local_social_graph != 0 )
                        {
                            social_graph = local_social_graph[being_attention( local_being, ATTENTION_ACTOR )];
                        }

                        local_episodic = being_episodic( local_being );
                        if ( local_episodic != 0 )
                        {
                            episodic = local_episodic[being_attention( local_being, ATTENTION_EPISODE )];
                        }

                    }
                }
                

                

                being_space( local_being, location_vect );

                if ( being_line_of_sight( local_current, location_vect ) == 0 )
                {
                    local_number = -1;
                }
                else if ( ( local_being != 0 ) && ( local_social_graph != 0 ) )
                {
                    switch ( second_value )
                    {

                    case VARIABLE_HONOR:
                        local_number = being_honor( local_being );
                        break;
                    case VARIABLE_PARASITES:
                        local_number = being_parasites( local_being );
                        break;
                    case VARIABLE_HEIGHT:
                        local_number = being_height( local_being );
                        break;
                    case VARIABLE_FIRST_NAME:
                        local_number = being_gender_name( local_being );
                        break;

                    case VARIABLE_FAMILY_NAME_ONE:
                        local_number = UNPACK_FAMILY_FIRST_NAME( being_family_name( local_being ) );
                        break;
                    case VARIABLE_FAMILY_NAME_TWO:
                        local_number = UNPACK_FAMILY_SECOND_NAME( being_family_name( local_being ) );
                        break;

                    case VARIABLE_GOAL_TYPE:
                        local_number = local_being.delta.goal[0];
                        break;
                    case VARIABLE_GOAL_X:
                        local_number = local_being.delta.goal[1];
                        break;
                    case VARIABLE_GOAL_Y:
                        local_number = local_being.delta.goal[2];
                        break;
                    case VARIABLE_POSTURE:
                        local_number = being_posture( local_being );
                        break;

                    case VARIABLE_DRIVE_HUNGER:
                        local_number = local_being.changes.drives[DRIVE_HUNGER];
                        break;
                    case VARIABLE_DRIVE_SOCIAL:
                        local_number = local_being.changes.drives[DRIVE_SOCIAL];
                        break;
                    case VARIABLE_DRIVE_FATIGUE:
                        local_number = local_being.changes.drives[DRIVE_FATIGUE];
                        break;
                    case VARIABLE_DRIVE_SEX:
                        local_number = local_being.changes.drives[DRIVE_SEX];
                        break;

                    case    VARIABLE_LOCATION_X:
                        local_number = being_location_x( local_being );
                        break;

                    case    VARIABLE_LOCATION_Y:
                        local_number = being_location_y( local_being );
                        break;

                    case    VARIABLE_ID_NUMBER:
                        local_number = GET_I( local_being );
                        break;

                    case    VARIABLE_DATE_OF_BIRTH:
                        local_number = being_dob( local_being );
                        break;
                    case    VARIABLE_STATE:
                        local_number = being_state( local_being );
                        break;
                    case    VARIABLE_PREFERENCE_MATE_HEIGHT_MALE:
                        local_number = local_being.changes.learned_preference[PREFERENCE_MATE_HEIGHT_MALE];
                        break;
                    case    VARIABLE_PREFERENCE_MATE_HEIGHT_FEMALE:
                        local_number = local_being.changes.learned_preference[PREFERENCE_MATE_HEIGHT_FEMALE];
                        break;
                    case    VARIABLE_PREFERENCE_MATE_PIGMENTATION_MALE:
                        local_number = local_being.changes.learned_preference[PREFERENCE_MATE_PIGMENTATION_MALE];
                        break;
                    case    VARIABLE_PREFERENCE_MATE_PIGMENTATION_FEMALE:
                        local_number = local_being.changes.learned_preference[PREFERENCE_MATE_PIGMENTATION_FEMALE];
                        break;
                    case    VARIABLE_PREFERENCE_MATE_HAIR_MALE:
                        local_number = local_being.changes.learned_preference[PREFERENCE_MATE_HAIR_MALE];
                        break;
                    case    VARIABLE_PREFERENCE_MATE_HAIR_FEMALE:
                        local_number = local_being.changes.learned_preference[PREFERENCE_MATE_HAIR_FEMALE];
                        break;
                    case    VARIABLE_PREFERENCE_MATE_FRAME_MALE:
                        local_number = local_being.changes.learned_preference[PREFERENCE_MATE_FRAME_MALE];
                        break;
                    case    VARIABLE_PREFERENCE_MATE_FRAME_FEMALE:
                        local_number = local_being.changes.learned_preference[PREFERENCE_MATE_FRAME_FEMALE];
                        break;
                    case    VARIABLE_PREFERENCE_GROOM_MALE:
                        local_number = local_being.changes.learned_preference[PREFERENCE_GROOM_MALE];
                        break;
                    case    VARIABLE_PREFERENCE_GROOM_FEMALE:
                        local_number = local_being.changes.learned_preference[PREFERENCE_GROOM_FEMALE];
                        break;
                    case    VARIABLE_PREFERENCE_ANECDOTE_EVENT_MUTATION:
                        local_number = local_being.changes.learned_preference[PREFERENCE_ANECDOTE_EVENT_MUTATION];
                        break;
                    case    VARIABLE_PREFERENCE_ANECDOTE_AFFECT_MUTATION:
                        local_number = local_being.changes.learned_preference[PREFERENCE_ANECDOTE_AFFECT_MUTATION];
                        break;
                    case    VARIABLE_PREFERENCE_CHAT:
                        local_number = local_being.changes.learned_preference[PREFERENCE_CHAT];
                        break;
                    case    VARIABLE_ATTENTION_ACTOR_INDEX:
                        local_number = being_attention( local_being, ATTENTION_ACTOR );
                        break;
                    case    VARIABLE_ATTENTION_EPISODE_INDEX:
                        local_number = being_attention( local_being, ATTENTION_EPISODE );
                        break;
                    case    VARIABLE_ATTENTION_BODY_INDEX:
                        local_number = being_attention( local_being, ATTENTION_BODY );
                        break;
                    case    VARIABLE_SHOUT_CONTENT:
                        local_number = local_being.changes.shout[SHOUT_CONTENT];
                        break;
                    case    VARIABLE_SHOUT_HEARD:
                        local_number = local_being.changes.shout[SHOUT_HEARD];
                        break;
                    case    VARIABLE_SHOUT_CTR:
                        local_number = local_being.changes.shout[SHOUT_CTR];
                        break;
                    case    VARIABLE_SHOUT_VOLUME:
                        local_number = local_being.changes.shout[SHOUT_VOLUME];
                        break;
                    case    VARIABLE_SHOUT_FAMILY0:
                        local_number = local_being.changes.shout[SHOUT_FAMILY0];
                        break;
                    case    VARIABLE_SHOUT_FAMILY1:
                        local_number = local_being.changes.shout[SHOUT_FAMILY1];
                        break;

                    case VARIABLE_SOCIAL_GRAPH_LOCATION_X:
                        local_number = social_graph.space_time.location[0];
                        break;
                    case VARIABLE_SOCIAL_GRAPH_LOCATION_Y:
                        local_number = social_graph.space_time.location[1];
                        break;
                    case VARIABLE_SOCIAL_GRAPH_TIME:
                        local_number = social_graph.space_time.time;
                        break;
                    case VARIABLE_SOCIAL_GRAPH_DATE:
                        local_number = social_graph.space_time.date;
                        break;
                    case VARIABLE_SOCIAL_GRAPH_ATTRACTION:
                        local_number = social_graph.attraction;
                        break;
                    case VARIABLE_SOCIAL_GRAPH_FOF:
                        local_number =
                            social_graph.friend_foe -
                            social_respect_mean( local_being );
                        break;
                    case VARIABLE_SOCIAL_GRAPH_FAMILIARITY:
                        local_number = social_graph.familiarity;
                        break;
                    case VARIABLE_MEMORY_FIRST_NAME:
                        local_number = social_graph.first_name[BEING_MET];
                        break;

                    case VARIABLE_MEMORY_FAMILY_NAME_ONE:
                        local_number = UNPACK_FAMILY_FIRST_NAME( social_graph.family_name[BEING_MET] );
                        break;
                    case VARIABLE_MEMORY_FAMILY_NAME_TWO:
                        local_number = UNPACK_FAMILY_SECOND_NAME( social_graph.family_name[BEING_MET] );
                        break;


                    case VARIABLE_MEMORY_LOCATION_X:
                        local_number = episodic.space_time.location[0];
                        break;
                    case VARIABLE_MEMORY_LOCATION_Y:
                        local_number = episodic.space_time.location[1];
                        break;
                    case VARIABLE_MEMORY_TIME:
                        local_number = episodic.space_time.time;
                        break;
                    case VARIABLE_MEMORY_DATE:
                        local_number = episodic.space_time.date;
                        break;
                    case VARIABLE_MEMORY_FIRST_NAME0:
                        local_number = episodic.first_name[0];
                        break;
                    case VARIABLE_MEMORY_FIRST_NAME1:
                        local_number = episodic.first_name[BEING_MET];
                        break;

                    case VARIABLE_MEMORY_FAMILY_NAME_ONE0:
                        local_number = UNPACK_FAMILY_FIRST_NAME( episodic.family_name[0] );
                        break;
                    case VARIABLE_MEMORY_FAMILY_NAME_TWO0:
                        local_number = UNPACK_FAMILY_SECOND_NAME( episodic.family_name[0] );
                        break;
                    case VARIABLE_MEMORY_FAMILY_NAME_ONE1:
                        local_number = UNPACK_FAMILY_FIRST_NAME( episodic.family_name[BEING_MET] );
                        break;
                    case VARIABLE_MEMORY_FAMILY_NAME_TWO1:
                        local_number = UNPACK_FAMILY_SECOND_NAME( episodic.family_name[BEING_MET] );
                        break;

                    case VARIABLE_MEMORY_EVENT:
                        local_number = episodic.event;
                        break;
                    case VARIABLE_MEMORY_AFFECT:
                        local_number = episodic.affect - EPISODIC_AFFECT_ZERO;
                        break;

                    }
                }
            }

            break;
            }
set_number( number, local_number );
            return 0;
        }
    }
    return -1; 
}

function sim_interpret(input_file) {
var _tmp = 0;
    input_file.size = input_file.location;
    input_file.location = 0;

    interpret = parse_convert( input_file, VARIABLE_BEING, apescript_variable_codes );

    if ( interpret == 0 )
    {
        return -1;
    }
    else
    {
        SC_DEBUG_ON( group.select ); 
    }

    interpret.sc_input  = sim_input;
    interpret.sc_output = sim_output;

    interpret.input_greater   = VARIABLE_WEATHER;
    interpret.special_less    = VARIABLE_VECT_X;
    return 0;
}

function sim_brain_dialogue_loop(group, local_being, data) {
var _tmp = 0;
var awake = 1;
var local_internal = being_braincode_internal( local_being );
var local_external = being_braincode_external( local_being );
    if ( local_being.delta.awake == 0 )
    {
        awake = 0;
    }
    
    brain_dialogue( group, awake, local_being, local_being, local_internal, local_external, being_random( local_being ) % SOCIAL_SIZE );
    brain_dialogue( group, awake, local_being, local_being, local_external, local_internal, being_random( local_being ) % SOCIAL_SIZE );
}

function sim_being_awake_loop_no_sim(local_being) {
var _tmp = 0;
var awake_condition = being_awake( local_being );
    local_being.delta.awake = awake_condition;


    being_register_movement( local_being, "awake condition" );

}

function sim_being_cycle(group, local_being, data) {
var _tmp = 0;
    if ( local_being.delta.awake == 0 )
    {
        return;
    }

    being_cycle_awake( group, local_being );
}

function sim_being_interpret(group, local_being, data) {
var _tmp = 0;
var individual;

    interpret_individual( individual );

    if ( local_being.delta.awake == 0 )
    {
        return;
    }

    if ( interpret == 0 )
    {
        return;
    }

    if ( interpret_cycle( interpret, individual, -1,
                          group.beings, local_being,
                          sim_start_conditions, sim_end_conditions ) == -1 )
    {
        interpret_cleanup( interpret );
    }
}

function sim_time(group) {
var _tmp = 0;
var timing = sim_timing();

    timing.count_cycles += group.num;

    timing.count_frames ++;

    if ( ( timing.real_time - timing.last_time ) > 60 )
    {
        timing.last_time = timing.real_time;
        timing.delta_cycles = timing.count_cycles;
        timing.delta_frames = timing.count_frames;
        timing.count_cycles = 0;
        timing.count_frames = 0;
    }
}

function sim_being_remove_final(group, brls) {
var _tmp = 0;
    group.num = brls.count;
    if ( brls.selected_died )
    {
        if ( brls.count )
        {
            sim_set_select( group.beings );
        }
        else
        {
            sim_set_select( 0 );
        }
    }

    if ( brls.count == 0 )
    {
        if ( sim_new_run == 0 )
        {
            SHOW_ERROR( "No Apes remain start new run" );
            sim_new_run = 1;
        }
    }
    being_remove_internal_clear();
    memory_free( brls );
}

function sim_update_output() {
var _tmp = 0;
    if ( sim_desire_output == 0 )
    {
        return;
    }

    if ( group.select == 0 )
    {
        return;
    }
    sim_writing_output = 1;
    memory_erase( sim_console_output, STRING_BLOCK_SIZE );
    watch_control( group, being_get_select_name( group ), group.select, sim_console_output );
    sim_writing_output = 0;
}

function sim_cycle() {
var _tmp = 0;
    if ( local_execution == KIND_PRE_STARTUP )
    {
        return;
    }
    if ( local_execution != KIND_NOTHING_TO_RUN )
    {
        if ( local_execution != KIND_MEMORY_SETUP )
        {
            if ( local_execution != KIND_NEW_APES )
            {
                land_clear( local_execution, AGE_OF_MATURITY );

                land_init();
                land_init_high_def( 1 );
                land_tide();

            }
            if ( local_execution != KIND_LOAD_FILE )
            {
                var local_random = new Array(2);
var genetics = land_genetics();
                local_random[0] = genetics[0];
                local_random[1] = genetics[1];

                math_random3( local_random );


                weather_init();

                
                group.num = being_init_group( group.beings, local_random, group.max >> 1, group.max );
            }
        }

        sim_set_select( group.beings );

        sim_new_progress = 0;
        local_execution = KIND_NOTHING_TO_RUN;
    }

var max_honor = 0;

    land_cycle();

    weather_cycle();


    loop_being_no_sim_no_data( group.beings, group.num, sim_being_awake_loop_no_sim );
    loop_being_no_sim_no_data( group.beings, group.num, being_cycle_universal );


    if ( interpret )
    {
        loop_being( group, sim_being_interpret, PROCESSING_WELTER_WEIGHT );
    }
    else

    {
        
        loop_being( group, being_listen, PROCESSING_FEATHER_WEIGHT );

        loop_being_no_sim_no_data( group.beings, group.num, episodic_cycle_no_sim );

        loop_being( group, sim_being_cycle, PROCESSING_MIDDLE_WEIGHT );
        loop_being( group, drives_cycle, PROCESSING_LIGHT_WEIGHT );
    }


    {
        loop_being( group, sim_brain_dialogue_loop, PROCESSING_MIDDLE_WEIGHT );
    }


    loop_being_no_sim( group.beings, group.num, being_tidy_loop_no_sim, max_honor );

    loop_being( group, social_initial_loop, PROCESSING_LIGHT_WEIGHT );

    if ( max_honor )
    {
        loop_being_no_sim_no_data( group.beings, group.num, being_recalibrate_honor_loop_no_sim );
    }

    loop_being_no_sim_no_data( group.beings, group.num, social_secondary_loop_no_sim );

    {
var selected_name = new Array( STRING_BLOCK_SIZE );
var selected_lives = 1;
var brls = being_remove_initial( group );
        if ( group.select )
        {
            selected_name = being_name_simple( group.select, selected_name );
        }
        if ( group.ext_death != 0 )
        {
            loop_no_thread( group, 0, being_remove_loop1, 0 );
        }
        loop_no_thread( group, 0, being_remove_loop2, brls );
        selected_lives = brls.selected_died == 0;
        sim_being_remove_final( group, brls );

        loop_being_no_sim_no_data( group.beings, group.num, being_speed_advance );

        if ( selected_lives )
        {
var new_select = sim_select_name( selected_name );
            if ( new_select != group.select )
            {
                sim_set_select( new_select );
            }
        }
    }

    sim_time( group );
}

function sim_memory_allocated(max) {
var _tmp = 0;
    if ( max )
    {
        return MAXIMUM_ALLOCATION;
    }
    else
    {
        return initial_memory_allocated;
    }
}

function being_memory(group, buffer, location, memory_available) {
var _tmp = 0;
var lpx = 0;

    group.max = LARGE_SIM;

    while ( lpx < group.max )
    {
var local_being = ( group.beings[ lpx ] );
        memory_erase( local_being, sizeof("simulated_being") );
        lpx ++;
    }
    return 0;
}

function sim_memory(offscreen_size) {
var _tmp = 0;
var current_location = 0;
var memory_allocated = MAXIMUM_ALLOCATION;

    offbuffer = memory_new_range( offscreen_size + MINIMAL_ALLOCATION, memory_allocated );

    if ( offbuffer == 0 )
    {
        return SHOW_ERROR( "Memory not available" );
    }

    memory_erase( offbuffer, memory_allocated );
    memory_erase( group.remains, sizeof("simulated_remains") );

    return being_memory( group, offbuffer, current_location, memory_allocated );
}

function debug_birth_event(born, mother, sim) {
var _tmp = 0;
    var name = new Array( STRING_BLOCK_SIZE );
    var mother_name = new Array( STRING_BLOCK_SIZE );
    var father_name = new Array( STRING_BLOCK_SIZE );
    name = being_name_simple( born, name );
    mother_name = being_name_simple( mother, mother_name );
    father_name = being_name_byte2( mother.changes.father_name[0], mother.changes.father_name[1], father_name );
    printf( "*** Born: %s (Mother: %s Father: %s)\n", name, mother_name, father_name );
}

function debug_death_event(deceased, sim) {
var _tmp = 0;
    var name = new Array( STRING_BLOCK_SIZE );
    name = being_name_simple( deceased, name );
    printf( "*** Dead: %s\n", name );
}

function sim_init(kind, randomise, offscreen_size, landbuffer_size) {
var _tmp = 0;
    var local_random = new Array(2);

    sim_writing_output = 1;
    sim_new_progress = 1;

    if ( kind == KIND_NEW_SIMULATION )
    {

        if ( interpret )
        {
            interpret_cleanup( interpret );
            interpret = 0;
        }

        memory_execute(io_command_line_execution_set);
    }
    timing.real_time = randomise;
    timing.last_time = randomise;


    randomise = FIXED_RANDOM_SIM;


    timing.delta_cycles = 0;
    timing.count_cycles = 0;
    timing.delta_frames = 0;
    timing.count_frames = 0;


    group.ext_birth = debug_birth_event;
    group.ext_death = debug_death_event;

    group.ext_birth = 0;
    group.ext_death = 0;


    if ( ( kind == KIND_START_UP ) || ( kind == KIND_MEMORY_SETUP ) )
    {
        if ( sim_memory( offscreen_size ) != 0 )
        {
            return 0;
        }
    }

    local_random[0] = ( randomise >> 16 ) & 0xffff;
    local_random[1] = ( randomise & 0xffff );

    math_random3( local_random );

    if ( ( kind != KIND_LOAD_FILE ) && ( kind != KIND_MEMORY_SETUP ) )
    {
        land_seed_genetics( local_random );
    }

    being_remains_init( ( group.remains ) ); 

    local_execution = kind;
    return (  offbuffer );
}

function sim_close() {
var _tmp = 0;
    command_quit( 0, 0, 0 );
    io_console_quit();

    sim_console_clean_up();


    interpret_cleanup( interpret );

    memory_free(  offbuffer );
    
}

function sim_set_select(select) {
var _tmp = 0;
    if ( Array.isArray( select ) )
    {
        group.select = select.length ? select[0] : 0;
        return;
    }
    group.select = select;
}

function sim_flood_loop(group, local, data) {
var _tmp = 0;
    var location = vect2_new();

    being_space( local, location );
    spacetime_convert_to_map( location );

    if ( land_location_vect( location ) < 160 )
    {
        being_dead( local );
    }
}

function sim_flood() {
var _tmp = 0;
    loop_no_thread( group, 0, sim_flood_loop, 0 );
}

function sim_healthy_carrier() {
var _tmp = 0;
var loop = ( group.num >> 2 );

    while ( loop < group.num )
    {
var local = group.beings[loop];
        being_dead( local );
        loop++;
    }
}
