
/****************************************************************

 being.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var start_z;
var offset_x;
var offset_y;
var visibility_delta;
var visibility_total;
var being_can_move_local = 0;
var being_wrap_local = 0;
var being_local_initial_location_local = 0;
var being_line_of_sight_local = 0;
var being_brain_cycle_local = 0;
var NAMES_SURNAMES = 256;
var NAMES_FIRST = 256;
var FAMILY_NAME_AND_MOD = null;
var FIRST_NAME_AND_MOD = null;
var UNPACK_FAMILY_FIRST_NAME = (...args) => (null);
var UNPACK_FAMILY_SECOND_NAME = (...args) => (null);
var GET_NAME_FAMILY = (...args) => (null);

function being_can_move(location, delta) {
var _tmp = 0;
    if ( being_can_move_local )
    {
        return being_can_move_local( location, delta );
    }
    return 1;
}

function being_can_move_override(new_can_move) {
var _tmp = 0;
    being_can_move_local = new_can_move;
}

function being_wrap(location) {
var _tmp = 0;
    if ( being_wrap_local )
    {
        being_wrap_local( location );
    }
    else
    {
var px = location.x;
var py = location.y;

        px = ( px + APESPACE_BOUNDS + 1 ) & APESPACE_BOUNDS;
        py = ( py + APESPACE_BOUNDS + 1 ) & APESPACE_BOUNDS;

        location.x = px;
        location.y = py;
    }
}

function being_wrap_override(new_move) {
var _tmp = 0;
    being_wrap_local = new_move;
}

function being_initial_location(location, seed) {
var _tmp = 0;
    if ( being_local_initial_location_local )
    {
        being_local_initial_location_local( location, seed );
    }
    else
    {
var loop = 0;

        do
        {
            location.x = math_random( seed ) & APESPACE_BOUNDS;
            location.y = math_random( seed ) & APESPACE_BOUNDS;

            being_wrap( location );

            loop ++;
        }
        while ( ( loop < 20 ) && ( WATER_TEST( land_location( APESPACE_TO_MAPSPACE( location.x ),
                                               APESPACE_TO_MAPSPACE( location.y ) ), land_tide_level() ) ) );

    }
}

function being_initial_location_override(new_initial_location) {
var _tmp = 0;
    being_local_initial_location_local = new_initial_location;
}

function being_los(local, location) {
var _tmp = 0;
var local_facing = ( ( being_facing( local ) ) >> 5 );
    var temp_location = vect2_new();

    temp_location.x = location.x;
    temp_location.y = location.y;

    

    

    if ( being_los_projection( local, temp_location ) == 1 )
    {
        return 1;
    }

    if ( ( local_facing == 6 ) || ( local_facing == 7 ) || ( local_facing == 0 ) || ( local_facing == 1 ) || ( local_facing == 2 ) )
    {
        temp_location.x = location.x + MAP_APE_RESOLUTION_SIZE;
        temp_location.y = location.y;

        if ( being_los_projection( local, temp_location ) == 1 )
        {
            return 1;
        }
    }

    if ( ( local_facing == 7 ) || ( local_facing == 0 ) || ( local_facing == 1 ) || ( local_facing == 2 ) || ( local_facing == 3 ) )
    {
        temp_location.x = location.x + MAP_APE_RESOLUTION_SIZE;
        temp_location.y = location.y + MAP_APE_RESOLUTION_SIZE;
        if ( being_los_projection( local, temp_location ) == 1 )
        {
            return 1;
        }
    }
    if ( ( local_facing == 0 ) || ( local_facing == 1 ) || ( local_facing == 2 ) || ( local_facing == 3 ) || ( local_facing == 4 ) )
    {
        temp_location.x = location.x;
        temp_location.y = location.y + MAP_APE_RESOLUTION_SIZE;
        if ( being_los_projection( local, temp_location ) == 1 )
        {
            return 1;
        }
    }
    if ( ( local_facing == 1 ) || ( local_facing == 2 ) || ( local_facing == 3 ) || ( local_facing == 4 ) || ( local_facing == 5 ) )
    {
        temp_location.x = location.x - MAP_APE_RESOLUTION_SIZE;
        temp_location.y = location.y + MAP_APE_RESOLUTION_SIZE;
        if ( being_los_projection( local, temp_location ) == 1 )
        {
            return 1;
        }
    }
    if ( ( local_facing == 2 ) || ( local_facing == 3 ) || ( local_facing == 4 ) || ( local_facing == 5 ) || ( local_facing == 6 ) )
    {
        temp_location.x = location.x - MAP_APE_RESOLUTION_SIZE;
        temp_location.y = location.y;
        if ( being_los_projection( local, temp_location ) == 1 )
        {
            return 1;
        }
    }
    if ( ( local_facing == 3 ) || ( local_facing == 4 ) || ( local_facing == 5 ) || ( local_facing == 6 ) || ( local_facing == 7 ) )
    {
        temp_location.x = location.x - MAP_APE_RESOLUTION_SIZE;
        temp_location.y = location.y - MAP_APE_RESOLUTION_SIZE;
        if ( being_los_projection( local, temp_location ) == 1 )
        {
            return 1;
        }
    }
    if ( ( local_facing == 4 ) || ( local_facing == 5 ) || ( local_facing == 6 ) || ( local_facing == 7 ) || ( local_facing == 0 ) )
    {
        temp_location.x = location.x;
        temp_location.y = location.y - MAP_APE_RESOLUTION_SIZE;
        if ( being_los_projection( local, temp_location ) == 1 )
        {
            return 1;
        }
    }
    if ( ( local_facing == 5 ) || ( local_facing == 6 ) || ( local_facing == 7 ) || ( local_facing == 0 ) || ( local_facing == 1 ) )
    {
        temp_location.x = location.x + MAP_APE_RESOLUTION_SIZE;
        temp_location.y = location.y - MAP_APE_RESOLUTION_SIZE;
        if ( being_los_projection( local, temp_location ) == 1 )
        {
            return 1;
        }
    }
    return 0;
}

function being_random3(value) {
var _tmp = 0;
    math_random3( value.delta.random_seed );
}

function being_random(value) {
var _tmp = 0;
    return math_random( value.delta.random_seed );
}

function being_set_random(value, seed) {
var _tmp = 0;
    value.delta.random_seed[0] = seed[0];
    value.delta.random_seed[1] = seed[1];
}

function being_set_random1(value, seed1) {
var _tmp = 0;
    value.delta.random_seed[1] = seed1;
}

function being_get_random(value) {
var _tmp = 0;
    return value.delta.random_seed;
}

function being_genetic_count_zeros(count) {
var _tmp = 0;
var loop = 0;
var addition = 0;
    while ( loop < sizeof("n_genetics") * 8 )
    {
        if ( ( ( count >> loop ) & 1 ) == 0 )
        {
            addition++;
        }
        loop++;
    }
    return addition;
}

function being_genetic_comparison(primary, secondary, parse_requirements) {
var _tmp = 0;
var loop = 0;
var addition = 0;

    if ( FIND_SEX( secondary[CHROMOSOME_Y] ) != SEX_FEMALE )
    {
        if ( parse_requirements == 1 )
        {
            return 0;
        }
    }
    else
    {
        if ( parse_requirements == 0 )
        {
            return 0;
        }
    }

    while ( loop < CHROMOSOMES )
    {
var comparison = primary[loop] ^ secondary[loop];
        addition += being_genetic_count_zeros( comparison );
        loop++;
    }
    return addition;
}

function being_line_of_sight_override(new_line_of_sight) {
var _tmp = 0;
    being_line_of_sight_local = new_line_of_sight;
}

function being_line_of_sight(local, location) {
var _tmp = 0;
    if ( being_line_of_sight_local )
    {
        return being_line_of_sight_local( local, location );
    }
    else
    {
        return being_los( local, location );
    }
}

function being_brain_cycle_override(new_brain_cycle) {
var _tmp = 0;
    being_brain_cycle_local = new_brain_cycle;
}

function being_brain_cycle(local, constants) {
var _tmp = 0;
    if ( being_brain_cycle_local )
    {
        being_brain_cycle_local( local, constants );
    }
    else
    {
        brain_cycle( local, constants );
    }
}

function being_braincode_external(value) {
var _tmp = 0;
var social_value = being_social( value );
    return social_value[ATTENTION_EXTERNAL].braincode;
}

function being_clear_attention(value) {
var _tmp = 0;
    memory_erase( ( value.braindata.attention ), ATTENTION_SIZE );
}

function being_set_attention(value, index, attention) {
var _tmp = 0;
    value.braindata.attention[index] = attention;
}

function being_attention(value, index) {
var _tmp = 0;
    return value.braindata.attention[index];
}

function being_braincode_internal(value) {
var _tmp = 0;
var social_value = being_social( value );
var attention_location = being_attention( value, ATTENTION_ACTOR );
    return social_value[attention_location].braincode;
}

function being_clear_attention(value) {
var _tmp = 0;
}

function being_set_attention(value, index, attention) {
var _tmp = 0;
}

function being_attention(value, index) {
var _tmp = 0;
    return 0;
}

function being_unpack_family(name, values) {
var _tmp = 0;
    values[0] = UNPACK_FAMILY_FIRST_NAME( name );
    values[1] = UNPACK_FAMILY_SECOND_NAME( name );
}

function being_first_name(value) {
var _tmp = 0;
    if ( value == 0 )
    {
        return 0;
    }
    {
        return value.constant.name[0] & FIRST_NAME_AND_MOD;
    }
}

function being_set_first_name(value, name) {
var _tmp = 0;
    value.constant.name[0] =  name & FIRST_NAME_AND_MOD;
}

function being_set_family_name(value, first, last) {
var _tmp = 0;
    value.constant.name[1] =  ( first | ( last << 8 ) );
}

function being_gender_name(value) {
var _tmp = 0;
    if ( value == 0 )
    {
        return 0;
    }
    return ( ( being_first_name( value ) | ( FIND_SEX( GET_I( value ) ) << 8 ) ) );
}

function being_family_name(value) {
var _tmp = 0;
    if ( value == 0 )
    {
        return 0;
    }
    return ( GET_NAME_FAMILY( being_family_first_name( value ), being_family_second_name( value ) ) );
}

function being_name_comparison(value, gender_name, family_name) {
var _tmp = 0;
    return ( ( being_gender_name( value ) == gender_name ) && ( being_family_name( value ) == family_name ) );
}

function being_family_first_name(value) {
var _tmp = 0;
    if ( value == 0 )
    {
        return 0;
    }
    {
        return UNPACK_FAMILY_FIRST_NAME( value.constant.name[1] );
    }
}

function being_family_second_name(value) {
var _tmp = 0;
    if ( value == 0 )
    {
        return 0;
    }
    {
        return UNPACK_FAMILY_SECOND_NAME( value.constant.name[1] );
    }
}

function being_name(female, first, family0, family1, name) {
var _tmp = 0;
    if ( !name )
    {
        name = new Array( STRING_BLOCK_SIZE );
    }
var position = 0;
    if ( first != -1 )
    {
        if ( female )
        {
            io_string_write( name, english_female_first_names[ first ], position );
        }
        else
        {
            io_string_write( name, english_male_first_names[ first ], position );
        }
        io_string_write( name, " ", position );
        io_string_write( name, english_last_names[ family0 ], position );
        io_string_write( name, "-", position );
        io_string_write( name, english_last_names[ family1 ], position );
    }
    else
    {
        io_string_write( name, "Unknown", position );
    }
    return name;
}

function being_name_simple(value, str) {
var _tmp = 0;
    if ( !str )
    {
        str = new Array( STRING_BLOCK_SIZE );
    }
    if ( value )
    {
var is_female = FIND_SEX( GET_I( value ) ) == SEX_FEMALE;
var first_name = being_first_name( value );
var first_family_name = being_family_first_name( value );
var second_family_name = being_family_second_name( value );
        being_name( is_female, first_name, first_family_name, second_family_name, str );
    }
    else
    {
var position = 0;
        io_string_write( str, "Unknown", position );
    }
    return str;
}

function being_name_byte2(first, family, name) {
var _tmp = 0;
    if ( !name )
    {
        name = new Array( STRING_BLOCK_SIZE );
    }
    being_name( ( ( first >> 8 ) == SEX_FEMALE ),
                ( first & 255 ),
                UNPACK_FAMILY_FIRST_NAME( family ),
                UNPACK_FAMILY_SECOND_NAME( family ),
                name );
    return name;
}

function being_state_description(state, result) {
var _tmp = 0;
    
    var state_description = [
        "Sleeping", "Awake", "Hungry", "Swimming", "Eating", "Moving",
        "Speaking", "Shouting", "Grooming", "Suckling",
        "Showing Force", "Attacking", "No Food"
    ];
var string_length = 0;
var n = 2;

    if ( state == BEING_STATE_ASLEEP )
    {
        io_string_write( result, state_description[0], string_length );
        return;
    }

    while ( n < BEING_STATES )
    {
        if ( state & ( 1 << ( n - 1 ) ) )
        {
            if ( string_length > 0 )
            {
                io_string_write( result, ", ", string_length );
            }
            io_string_write( result, state_description[n], string_length );
        }
        n++;
    }
}

function being_move(local, rel_vel, kind) {
var _tmp = 0;
    var location_vector = vect2_new();
    var loc = new Array(2);
    being_space( local, location_vector );

    if ( kind == 1 )
    {
        var facing_vector = vect2_new();
        being_facing_vector( local, facing_vector, 1 );
        vect2_d( location_vector, facing_vector, rel_vel, 512 );
    }
    else
    {
        if ( rel_vel < 2 )
        {
            location_vector.y -= ( rel_vel * 200 ) - 100;
        }
        else
        {
            location_vector.x += 500 - ( rel_vel * 200 );
        }
    }

    being_wrap( location_vector );

    loc[0] = location_vector.x;
    loc[1] = location_vector.y;
    being_set_location( local, loc );
}

function being_crowding(value) {
var _tmp = 0;
    return value.delta.crowding;
}

function being_crowding_cycle(value, beings_in_vacinity) {
var _tmp = 0;
    
    if ( beings_in_vacinity < ( value.delta.crowding + SOCIAL_TOLLERANCE ) )
    {
        
        being_inc_drive( value, DRIVE_SOCIAL );
    }
    else
    {
        
        being_dec_drive( value, DRIVE_SOCIAL );
    }

    
    if ( beings_in_vacinity < value.delta.crowding )
    {
        if ( value.delta.crowding > MIN_CROWDING )
        {
            value.delta.crowding--;
        }
    }
    if ( beings_in_vacinity > value.delta.crowding )
    {
        if ( value.delta.crowding < MAX_CROWDING )
        {
            value.delta.crowding++;
        }
    }
}

function being_set_state(value, state) {
var _tmp = 0;
    value.delta.macro_state = state;
}

function being_add_state(value, state) {
var _tmp = 0;
    value.delta.macro_state |= state;

}

function being_state(value) {
var _tmp = 0;
    return value.delta.macro_state;
}

function being_brainstates(value, asleep, states) {
var _tmp = 0;
var three_offset = ( asleep ? 0 : 3 );

    states[0] = value.braindata.brain_state[three_offset + 0];
    states[1] = value.braindata.brain_state[three_offset + 1];
    states[2] = value.braindata.brain_state[three_offset + 2];

    return ( ( states[0] != 0 ) || ( states[1] != 1024 ) || ( states[2] != 0 ) );
}

function being_erase(value) {
var _tmp = 0;
    memory_erase( value, sizeof("simulated_being") );
}

function being_honor_delta(value, delta) {
var _tmp = 0;
var honor_value = value.delta.honor;
    if ( delta > 0 )
    {
        if ( ( honor_value + delta ) > 255 )
        {
            value.delta.honor = 255;
            return;
        }
    }
    else
    {
        if ( ( honor_value + delta ) < 0 )
        {
            value.delta.honor = 0;
            return;
        }
    }
    value.delta.honor += delta;
}

function being_honor(value) {
var _tmp = 0;
    return value.delta.honor;
}

function being_honor_inc_dec(inc, dec) {
var _tmp = 0;
    if ( inc.delta.honor < 255 )
    {
        inc.delta.honor++;
    }
    if ( dec.delta.honor > 0 )
    {
        dec.delta.honor--;
    }
}

function being_honor_swap(victor, vanquished) {
var _tmp = 0;
    if ( victor.delta.honor < vanquished.delta.honor )
    {
        
var temp_hon = victor.delta.honor;
        victor.delta.honor = vanquished.delta.honor;
        vanquished.delta.honor = temp_hon;
    }
}

function being_honor_compare(first, second) {
var _tmp = 0;
    if ( first.delta.honor > second.delta.honor )
    {
        return 1;
    }

    if ( first.delta.honor < second.delta.honor )
    {
        return -1;
    }

    return 0;
}

function being_honor_immune(value) {
var _tmp = 0;
var local_honor = being_honor( value );
    if ( local_honor < 250 ) 
    {
        return ( 1 + ( local_honor >> 6 ) );
    }
    return 2; 
}

function being_posture(value) {
var _tmp = 0;
    return value.delta.posture;
}

function being_set_posture(value, post) {
var _tmp = 0;
    value.delta.posture = post;
}

function being_posture_under(value, post) {
var _tmp = 0;
    return ( value.delta.posture < post );
}

function being_episodic(value) {
var _tmp = 0;
    return value.events.episodic;

}

function being_social(value) {
var _tmp = 0;
    return value.events.social;
}

function being_location_x(value) {
var _tmp = 0;
    return value.delta.location[0];
}

function being_location_y(value) {
var _tmp = 0;
    return value.delta.location[1];
}

function being_high_res(value, vector) {
var _tmp = 0;
    if ( !vector )
    {
        vector = vect2_new();
    }
    vector.x = APESPACE_TO_HR_MAPSPACE( being_location_x( value ) );
    vector.y = APESPACE_TO_HR_MAPSPACE( being_location_y( value ) );
    return vector;
}

function being_space(value, vector) {
var _tmp = 0;
    if ( !vector )
    {
        vector = vect2_new();
    }
    vector.x = value.delta.location[0];
    vector.y = value.delta.location[1];
    return vector;
}

function being_location(value) {
var _tmp = 0;
    return value.delta.location;
}

function being_set_location(value, from) {
var _tmp = 0;
    value.delta.location[0] = from[0];
    value.delta.location[1] = from[1];
}

function being_total_movement(value) {
var _tmp = 0;
    return  value.delta.total_movement;
}

function being_add_total_movement(value) {
var _tmp = 0;
    value.delta.total_movement += value.delta.velocity;
}

function being_zero_total_movement(value) {
var _tmp = 0;
    value.delta.total_movement = 0;
}

function being_register_movement(value, comment_string) {
var _tmp = 0;
    if ( ( IS_NIGHT( land_time() ) == 0 ) && ( being_total_movement( value ) == 0 ) )
    {
        var name_string = new Array( STRING_BLOCK_SIZE );
        var time_string = new Array( STRING_BLOCK_SIZE );
        time_string = spacetime_to_string( time_string );
        name_string = being_name_simple( value, name_string );
        printf( "%s %s %s\n", time_string, name_string, comment_string );
    }
}

function being_speed(value) {
var _tmp = 0;
    return value.delta.velocity[0];
}

function being_set_speed(value, sp) {
var _tmp = 0;
    value.delta.velocity[0] = sp;
}

function being_speed_advance(value) {
var _tmp = 0;
var loop = 0;
    while ( loop < 9 )
    {
        value.delta.velocity[9 - loop] = value.delta.velocity[8 - loop];
        loop++;
    }
}

function being_ten_minute_distance(value) {
var _tmp = 0;
var total_distance = 0;
var loop = 0;
    while ( loop < 10 )
    {
        total_distance += value.delta.velocity[loop];
        loop++;
    }
    return total_distance;
}

function being_delta(primary, secondary, delta) {
var _tmp = 0;
    delta.x = primary.delta.location[0] - secondary.delta.location[0];
    delta.y = primary.delta.location[1] - secondary.delta.location[1];
}

function being_add_parasites(value) {
var _tmp = 0;
    
    if ( value.delta.parasites < ( ( GENE_HAIR( being_genetics( value ) ) * 255 ) >> 4 ) )
    {
        value.delta.parasites++;
    }
}

function being_remove_parasites(value, number_of_parasites) {
var _tmp = 0;
    if ( value.delta.parasites > number_of_parasites )
    {
        value.delta.parasites -= number_of_parasites;
    }
    else
    {
        value.delta.parasites = 0;
    }
}

function being_parasites(value) {
var _tmp = 0;
    return value.delta.parasites;
}

function being_set_parasites(value, parasites) {
var _tmp = 0;
    value.delta.parasites = parasites;
}

function being_dob(value) {
var _tmp = 0;
    return value.constant.date_of_birth;
}

function being_facing_towards(value, vector) {
var _tmp = 0;
    value.delta.direction_facing = math_tan( vector );
}

function being_wander(value, wander) {
var _tmp = 0;
    value.delta.direction_facing = ( ( value.delta.direction_facing + 256 + wander ) & 255 );
}

function being_facing_init(value) {
var _tmp = 0;
    value.delta.direction_facing = ( being_random( value ) & 255 );
}

function being_facing_vector(value, vect, divisor) {
var _tmp = 0;
    if ( !vect )
    {
        vect = vect2_new();
    }
    vect2_direction( vect, value.delta.direction_facing, divisor * 32 );
    return vect;
}

function being_facing(value) {
var _tmp = 0;
    return value.delta.direction_facing;
}

function being_genetics(value) {
var _tmp = 0;
    return value.constant.genetics;
}

function being_pregnant(value) {
var _tmp = 0;
    return value.changes.date_of_conception;
}

function being_female(value) {
var _tmp = 0;
    return ( FIND_SEX( GET_I( value ) ) == SEX_FEMALE );
}

function being_speaking(value) {
var _tmp = 0;
    return ( value.delta.awake && ( being_state( value ) & BEING_STATE_SPEAKING ) );
}

function being_fetal_genetics(value) {
var _tmp = 0;
    return value.changes.fetal_genetics;
}

function being_energy(value) {
var _tmp = 0;
    return value.delta.stored_energy;
}

function being_energy_less_than(value, less_than) {
var _tmp = 0;
    return being_energy( value ) < less_than;
}

function being_dead(value) {
var _tmp = 0;
    value.delta.stored_energy = BEING_DEAD;
}

function being_living(value) {
var _tmp = 0;
    value.delta.stored_energy = BEING_FULL;
}

function being_energy_delta(value, delta) {
var _tmp = 0;
var total = value.delta.stored_energy + delta;

    if ( total < BEING_DEAD )
    {
        total = BEING_DEAD;
    }

    value.delta.stored_energy =  total;
}

function being_drive(value, drive) {
var _tmp = 0;
    return value.changes.drives[drive];
}

function being_drives(value) {
var _tmp = 0;
    return value.changes.drives;
}

function being_inc_drive(value, drive) {
var _tmp = 0;
    if ( value.changes.drives[drive] < DRIVES_MAX )
    {
        value.changes.drives[drive]++;
    }
}

function being_dec_drive(value, drive) {
var _tmp = 0;
    if ( value.changes.drives[drive] > 0 )
    {
        value.changes.drives[drive]--;
    }
}

function being_reset_drive(value, drive) {
var _tmp = 0;
    value.changes.drives[drive] = 0;
}

function being_height(value) {
var _tmp = 0;
    return value.delta.height;
}

function being_set_height(value, height) {
var _tmp = 0;
    value.delta.height = height;
}

function being_mass(value) {
var _tmp = 0;
    return value.delta.mass;
}

function being_turn_away_from_water(value) {
var _tmp = 0;
var it_water_turn = 0;
    var location_vector = vect2_new();

    being_space( value, location_vector );

    while ( it_water_turn < 7 )
    {
        
var iturn = 8 - it_water_turn;
var loc_f = being_facing( value );
var iturn_plus  = loc_f + iturn;
var iturn_minus = loc_f + ( 256 - iturn );

var turn_plus  = ( ( iturn_plus )  & 255 );
var turn_minus = ( ( iturn_minus ) & 255 );
        var temp_vector = vect2_new();

        var z_plus;
        var z_minus;

        vect2_direction( temp_vector, turn_plus, 128 );
        vect2_add( temp_vector, temp_vector, location_vector );

        spacetime_convert_to_map( temp_vector );

        z_plus = land_location_vect( temp_vector );

        vect2_direction( temp_vector, turn_minus, 128 );
        vect2_add( temp_vector, temp_vector, location_vector );

        spacetime_convert_to_map( temp_vector );

        z_minus = land_location_vect( temp_vector );

        if ( z_minus > z_plus )
        {
            being_wander( value, -iturn );
        }
        else if ( z_minus < z_plus )
        {
            being_wander( value, iturn );
        }
        it_water_turn++;
    }
}

function being_carried(value, location) {
var _tmp = 0;
    return ( value ).changes.inventory[location] & 0xfffff8;
}

function being_drop(value, location) {
var _tmp = 0;
    ( value ).changes.inventory[location] &= 7;
    being_set_attention( value, ATTENTION_BODY, location );
}

function being_take(value, location, object) {
var _tmp = 0;
    ( value ).changes.inventory[location] |= object;
    being_set_attention( value, ATTENTION_BODY, location );
}

function being_ground(px, py, dx, dy, params) {
var _tmp = 0;
var abs_sum = ABS( dx ) + ABS( dy );
var being_pixel =  params;
var d_vis = being_pixel.visibility_delta;
var local_z = ( ( px * ( being_pixel.offset_x ) ) + ( py * ( being_pixel.offset_y ) ) ) >> 9;

    if ( abs_sum )
    {
var seven_values = weather_seven_values( APESPACE_TO_MAPSPACE( px ), APESPACE_TO_MAPSPACE( py ) );
var span10 = ( ( abs_sum - 1 ) ? 1448 : 1024 );

        switch ( seven_values )
        {
        case WEATHER_SEVEN_SUNNY_DAY:
        case WEATHER_SEVEN_CLOUDY_DAY:
            being_pixel.visibility_total += ( span10 * ( d_vis + 16 ) ) >> 11;
            break;
        case WEATHER_SEVEN_RAINY_DAY:
        case WEATHER_SEVEN_DAWN_DUSK:
            being_pixel.visibility_total += ( span10 * ( ( 2 * d_vis ) + 25 ) ) >> 11;
            break;
        case WEATHER_SEVEN_CLEAR_NIGHT:
            being_pixel.visibility_total += ( span10 * ( ( 5 * d_vis ) + 65 ) ) >> 11;
        case WEATHER_SEVEN_CLOUDY_NIGHT:
            being_pixel.visibility_total += ( span10 * ( ( 8 * d_vis ) + 93 ) ) >> 11;
        case WEATHER_SEVEN_RAINY_NIGHT:
            being_pixel.visibility_total += ( span10 * ( ( 12 * d_vis ) + 145 ) ) >> 11;
            break;

        case WEATHER_SEVEN_ERROR:
        default:
            return 1;
        }
        if ( being_pixel.visibility_total > VISIBILITY_MAXIMUM )
        {
            return 1;
        }
        local_z += being_pixel.start_z;

        if ( local_z < WALK_ON_WATER( land_location( px, py ), land_tide_level() ) )
        {
            return 1;
        }
    }
    return 0;
}

function being_basic_line_of_sight(local, extern_end, start, delta, end) {
var _tmp = 0;
    var vector_facing = vect2_new();
    vect2_copy( end, extern_end );
    
    being_space( local, start );

    vect2_subtract( delta, end, start );
    {
var distance_squared = vect2_dot( delta, delta, 1, 1 );
        if ( distance_squared > ( VISIBILITY_SPAN * VISIBILITY_SPAN ) )
        {
            return 0;
        }
    }
    
    if ( ( delta.x == 0 ) && ( delta.y == 0 ) )
    {
        return 1;
    }
    being_facing_vector( local, vector_facing, 16 );
    
    if ( vect2_dot( vector_facing, delta, 1, 64 ) < 0 )
    {
        return 0;
    }
    return 2;
}

function being_los_projection(local, extern_end) {
var _tmp = 0;
    var start = vect2_new();
    var delta = vect2_new();
    var end = vect2_new();
var return_value = being_basic_line_of_sight( local, extern_end, start, delta, end );

    if ( return_value != 2 )
    {
        return return_value;
    }

    

    spacetime_convert_to_map( start );
    spacetime_convert_to_map( delta );
    spacetime_convert_to_map( end );

    
    if ( ( delta.x == 0 ) && ( delta.y == 0 ) )
    {
        return 1;
    }

    {
var simulated_iape_height = 3;
var start_z = WALK_ON_WATER( land_location_vect( start ), land_tide_level() ) + simulated_iape_height;
var delta_z = WALK_ON_WATER( land_location_vect( end ), land_tide_level() ) - start_z + simulated_iape_height;
var common_divisor = vect2_dot( delta, delta, 1, 1 );
var translate = {};

        if ( common_divisor == 0 )
        {
            common_divisor = 1;
        }

        {
var offset = vect2_new();

            vect2_d( offset, delta, 512 * delta_z, common_divisor );

            start_z -= vect2_dot( start, offset, 1, 512 );

            translate.start_z = start_z;
            translate.offset_x = offset.x;
            translate.offset_y = offset.y;

            translate.visibility_total = 100 * GENE_VISION_INITIAL( being_genetics( local ) );

            translate.visibility_delta = GENE_VISION_DELTA( being_genetics( local ) );
        }

        {
            var being_point = {};
            being_point.information =  translate;
            being_point.pixel_draw  = being_ground;

            if ( math_join_vect2( start.x, start.y, delta, being_point ) )
            {
                return 0;
            }
        }
    }
    return 1;
}

function being_init_braincode_create(local, internal) {
var _tmp = 0;
var local_random = being_get_random( local );

var ch = 0;
    
    while ( ch < BRAINCODE_SIZE )
    {
        math_random3( local_random );
        if ( internal != 0 )
        {

            being_braincode_internal( local )[ch] = math_random( local_random ) & 255;

            being_random3( local );
            being_braincode_internal( local )[ch] = ( math_random( local_random ) & 192 ) | get_braincode_instruction( local );

            being_braincode_internal( local )[ch + 1] = math_random( local_random ) & 255;
            being_braincode_internal( local )[ch + 2] = math_random( local_random ) & 255;
        }
        else
        {

            being_braincode_external( local )[ch] = math_random( local_random ) & 255;

            being_random3( local );
            being_braincode_external( local )[ch] = ( math_random( local_random ) & 192 ) | get_braincode_instruction( local );

            being_braincode_external( local )[ch + 1] = math_random( local_random ) & 255;
            being_braincode_external( local )[ch + 2] = math_random( local_random ) & 255;
        }
        ch += 3;
    }
}

function being_init_braincode(local, other, friend_foe, internal) {
var _tmp = 0;
    var i, most_similar_index, diff, min, actor_index;
    var graph;
    if ( other == 0 )
    {
        being_init_braincode_create( local, internal );
    }
    else
    {
        
        graph = being_social( local );

        if ( graph == 0 )
        {
            return;
        }

        most_similar_index = 0;
        min = 99999;
        actor_index = being_attention( local, ATTENTION_ACTOR );

        
        for ( i = 0; i < SOCIAL_SIZE; i++ )
        {
            if ( ( i != actor_index ) && ( !SOCIAL_GRAPH_ENTRY_EMPTY( graph, i ) ) )
            {
var signed_diff = graph[i].friend_foe - friend_foe;
                if ( signed_diff < 0 )
                {
                    diff = ( 0 - signed_diff );
                }
                else
                {
                    diff = signed_diff;
                }
                if ( diff < min )
                {
                    min = diff;
                    most_similar_index = i;
                }
            }
        }
        
        memory_copy( graph[most_similar_index].braincode, graph[actor_index].braincode, BRAINCODE_SIZE );
    }
}

function being_set_unique_name(beings, number, local_being, mother_family_name, father_family_name) {
var _tmp = 0;
    var i;
var samples = 0, found = 0;
    var possible_family_name;
    var possible_first_name;

    
    being_random3( local_being );
    being_random3( local_being );


    
    if ( ( mother_family_name == 0 ) && ( father_family_name == 0 ) )
    {
var random_factor = being_get_random( local_being );

        mother_family_name =
            GET_NAME_FAMILY( ( random_factor[0] & FAMILY_NAME_AND_MOD ),
                             ( random_factor[1] & FAMILY_NAME_AND_MOD ) );

        math_random3( random_factor );

        father_family_name =
            GET_NAME_FAMILY( ( random_factor[0] & FAMILY_NAME_AND_MOD ),
                             ( random_factor[1] & FAMILY_NAME_AND_MOD ) );
    }

    
    possible_family_name =
        GET_NAME_FAMILY( UNPACK_FAMILY_FIRST_NAME( mother_family_name ),
                         UNPACK_FAMILY_FIRST_NAME( father_family_name ) );

    while ( ( found == 0 ) && ( samples < 2048 ) )
    {
var random_factor = being_get_random( local_being );

        being_random3( local_being );

        
        possible_first_name = ( ( random_factor[0] & 255 ) | ( FIND_SEX( GET_I( local_being ) ) << 8 ) );


        
        if ( UNPACK_FAMILY_FIRST_NAME( mother_family_name ) ==
                UNPACK_FAMILY_SECOND_NAME( father_family_name ) )
        {

            being_random3( local_being );

            random_factor = being_get_random( local_being );

            possible_family_name =
                GET_NAME_FAMILY( ( random_factor[0] & FAMILY_NAME_AND_MOD ),
                                 ( random_factor[1] & FAMILY_NAME_AND_MOD ) );
        }
        if ( samples == 1024 )
        {
            being_random3( local_being );

            random_factor = being_get_random( local_being );

            possible_family_name =
                GET_NAME_FAMILY( ( random_factor[0] & FAMILY_NAME_AND_MOD ),
                                 ( random_factor[1] & FAMILY_NAME_AND_MOD ) );
        }

        
        if ( UNPACK_FAMILY_SECOND_NAME( mother_family_name ) ==
                UNPACK_FAMILY_FIRST_NAME( father_family_name ) )
        {
            being_random3( local_being );

            random_factor = being_get_random( local_being );

            possible_family_name =
                GET_NAME_FAMILY( ( random_factor[0] & FAMILY_NAME_AND_MOD ),
                                 ( random_factor[1] & FAMILY_NAME_AND_MOD ) );
        }

        being_set_first_name( local_being, possible_first_name );

        being_set_family_name( local_being,
                               UNPACK_FAMILY_FIRST_NAME( possible_family_name ),
                               UNPACK_FAMILY_SECOND_NAME( possible_family_name ) );

        
        found = 1;
        for ( i = 0; i < number; i++ )
        {
var other_being = beings[i];
            if ( being_name_comparison( local_being, being_gender_name( other_being ), being_family_name( other_being ) ) )
            {
                found = 0;
                break;
            }
        }
        samples++;
    }

    return found;
}

function being_random_genetics(value, random, male) {
var _tmp = 0;
var loop = 0;
    math_random3( random );
    while ( loop < CHROMOSOMES )
    {
var loop2 = 0;

        value[loop] = 0;

        while ( loop2 < ( sizeof("n_genetics") * 8 ) )
        {
            if ( math_random( random ) & 1 )
            {
                value[loop] |= 1 << loop2;
            }
            loop2++;
        }
        loop++;
    }
    value[CHROMOSOME_Y] = ( value[CHROMOSOME_Y] & 0xfffffffe );
    value[CHROMOSOME_Y] |= ( male ? 2 : 3 );
}

function being_init_group(beings, local_random, count_to, max) {
var _tmp = 0;
var num = 0;
    math_random3( local_random );

    while ( num < count_to )
    {
        math_random3( local_random );
        if ( ( num + 1 ) < max )
        {
            if ( being_init( beings, num, beings[num], 0, local_random ) != 0 )
            {
                being_erase( beings[num] );
                break;
            }
            else
            {
                num++;
            }
        }
    }
    return num;
}

function being_init(beings, number, local, mother, random_factor) {
var _tmp = 0;
var loop = 0;

var local_social_graph = being_social( local );
var local_episodic = being_episodic( local );

    if ( local_social_graph == 0 )
    {
        return SHOW_ERROR( "Social memory not available" );
    }
    if ( local_episodic == 0 )
    {
        return SHOW_ERROR( "Episodic memory not available" );
    }

    being_erase( local );


    being_set_goal_none( local );

    

    while ( loop < PREFERENCES )
    {
        local.changes.learned_preference[loop++] = 127;
    }

    immune_init( ( local.immune_system ), being_get_random( local ) );
    being_clear_attention( local );

    
    if ( mother )
    {
        local.constant.generation_max = mother.changes.child_generation_max + 1;
        local.constant.generation_min = mother.changes.child_generation_min + 1;
    }
    else
    {
        local.constant.generation_max = 0;
        local.constant.generation_min = 0;
    }
    local.changes.child_generation_max = 0;
    local.changes.child_generation_min = 0;

    


    if ( random_factor )
    {
        being_set_random( local, random_factor );

        being_random3( local );
        being_random3( local );
    }
    else if ( mother )
    {
        being_random( mother );

        being_set_random( local, being_get_random( mother ) );

        being_random3( local );

        being_set_random1( local, being_get_random( mother )[0] );

        being_random3( local );

        being_set_random1( local, land_time() );

        being_random3( local );
    }
    else
    {
        NA_ASSERT( random_factor, "Random factor not set" );
        NA_ASSERT( mother, "Mother not set" );
        return SHOW_ERROR( "No correct being interface provided" );
    }


    being_random3( local );


    
    memory_erase( local_social_graph, sizeof("simulated_isocial")*SOCIAL_SIZE );

    loop = 0;
    while ( loop < EPISODIC_SIZE )
    {
        local_episodic[loop++].affect = EPISODIC_AFFECT_ZERO;
    }

    local_social_graph[0].relationship = RELATIONSHIP_SELF;
    loop = 0;
    while ( loop < SOCIAL_SIZE )
    {
        
        local_social_graph[loop].entity_type = ENTITY_BEING;
        
        local_social_graph[loop].friend_foe = SOCIAL_RESPECT_NORMAL;
        loop++;
    }


    

    being_init_braincode( local, 0, 0, BRAINCODE_INTERNAL );
    being_init_braincode( local, 0, 0, BRAINCODE_EXTERNAL );

    
    loop = 0;
    while ( loop < BRAINCODE_PSPACE_REGISTERS )
    {
        being_random3( local );
        local.braindata.braincode_register[loop++] = being_random( local ) & 255;
    }

    
    loop = 0;
    while ( loop < BRAINCODE_PROBES )
    {
        being_random3( local );
        if ( being_random( local ) & 1 )
        {
            local.braindata.brainprobe[loop].type = INPUT_SENSOR;
        }
        else
        {
            local.braindata.brainprobe[loop].type = OUTPUT_ACTUATOR;
        }
        local.braindata.brainprobe[loop].frequency = 1 + ( being_random( local ) % BRAINCODE_MAX_FREQUENCY );
        being_random3( local );
        local.braindata.brainprobe[loop].address = being_random( local ) & 255;
        local.braindata.brainprobe[loop].position = being_random( local ) & 255;
        being_random3( local );
        local.braindata.brainprobe[loop].offset = being_random( local ) & 255;
        loop++;
    }


    being_facing_init( local );

    if ( random_factor )
    {
        var location = new Array(2);
        var location_vector = vect2_new();
        being_random3( local );

        being_initial_location( location_vector, being_get_random( local ) );

        location[0] = location_vector.x;
        location[1] = location_vector.y;

        being_set_location( local, location );

        {
            var mother_genetics = new Array(CHROMOSOMES);
            var father_genetics = new Array(CHROMOSOMES);
            var gene_random = new Array(2);

            being_random3( local );

            gene_random[0] = being_random( local );

            being_random3( local );
            being_random3( local );

            gene_random[1] = being_random( local );

            being_random_genetics( mother_genetics, gene_random, 0 );

            being_random3( local );

            gene_random[0] = being_random( local );
            being_random3( local );
            being_random3( local );
            being_random3( local );

            gene_random[1] = being_random( local );

            being_random_genetics( father_genetics, gene_random, 1 );
            being_random3( local );

            body_genetics( beings, number, being_genetics( local ), mother_genetics, father_genetics, gene_random );

            being_set_unique_name( beings, number, local, 0, 0 );
        }
        local.delta.social_coord_x = local.delta.social_coord_nx =
                                          ( math_random( local.delta.random_seed ) & 32767 ) + 16384;
        local.delta.social_coord_y = local.delta.social_coord_ny =
                                          ( math_random( local.delta.random_seed ) & 32767 ) + 16384;

        local.constant.date_of_birth = 0;
    }
    else
    {
        being_set_location( local, being_location( mother ) );

        
        being_wander( local, being_facing( mother ) - being_facing( local ) );

         being_random( local );
        local.delta.social_coord_x = local.delta.social_coord_nx = mother.delta.social_coord_x;
        local.delta.social_coord_y = local.delta.social_coord_ny = mother.delta.social_coord_y;

        genetics_set( being_genetics( local ), being_fetal_genetics( mother ) );

        
        local.delta.honor = being_honor( mother );

        being_set_unique_name( beings, number, local,
                               being_family_name( mother ),
                               mother.changes.father_name[1] );

        local.constant.date_of_birth = land_date();
    }

    being_living( local );

    if ( random_factor )
    {
        being_set_height( local, BIRTH_HEIGHT );

        local.delta.mass = BIRTH_MASS;
    }
    else
    {
        
        being_random3( local );
        being_set_height( local, BIRTH_HEIGHT +
                          ( local.delta.random_seed[0] % ( BEING_MAX_HEIGHT - BIRTH_HEIGHT ) ) );

        local.delta.mass = BIRTH_MASS +
                         ( local.delta.random_seed[1] % ( BEING_MAX_MASS_G - BIRTH_MASS ) );
    }

    local.delta.crowding = MIN_CROWDING;

    return 0;
}

function being_move_energy(local_being, conductance) {
var _tmp = 0;
var local_s  = being_speed( local_being );
var delta_e = 0;
    var location_vector = vect2_new();
    var facing_vector = vect2_new();
var genetics = being_genetics( local_being );

    being_space( local_being, location_vector );

    being_facing_vector( local_being, facing_vector, 1 );

    if ( local_s > 0 )
    {
        var location = new Array(2);
        vect2_d( location_vector, facing_vector, local_s, 512 );

        

        being_wrap( location_vector );

        location[0] = location_vector.x;
        location[1] = location_vector.y;

        being_set_location( local_being, location );

        being_add_total_movement( local_being );

    }

    {
        var delta_z;
        var delta_energy;
        var local_z;
        var slope_vector = vect2_new();

        local_z = land_vect2( slope_vector, local_z, location_vector );

        delta_z = vect2_dot( slope_vector, facing_vector, 1, 96 );
        delta_energy = ( ( 512 - delta_z ) * local_s ) / 80;

        if ( WATER_TEST( local_z, land_tide_level() ) )
        {
var insulation = 0;
            
var fat_mass = GET_BODY_FAT( local_being );
            delta_energy = ( ( delta_energy * delta_energy ) >> 9 );
            if ( fat_mass > BEING_MAX_MASS_FAT_G )
            {
                fat_mass = BEING_MAX_MASS_FAT_G;
            }
            insulation = fat_mass * 5 / BEING_MAX_MASS_FAT_G;
            delta_e += ( delta_energy + 10 - insulation ) >> 3;
conductance = 4;
        }
        else
        {
            if ( delta_z > 0 )
            {
                
                delta_energy += GENE_HILL_CLIMB( genetics );
            }

            delta_energy = ( ( delta_energy * delta_energy ) >> 9 );

            
            delta_e += ( delta_energy + 4 + ( GET_M( local_being ) * 5 / BEING_MAX_MASS_G ) ) >> 2;
        }
    }
    return delta_e;
}
