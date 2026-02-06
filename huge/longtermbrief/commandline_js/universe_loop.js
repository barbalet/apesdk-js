
/****************************************************************

 loop.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var name;
var being_from_name;
var parse_requirements;
var older;
var comparison_best;
var actual_age;
var genetics;
var return_value;
var comparison_best;
var max_age;
var genetics;
var return_value;
var first_gender;
var family;
var local;
var counter;
var return_value;
var being;
var being_remove_internal_value = 0;
var being_remove_external_value = 0;

function loop_no_thread(group, being_not, bf_func, data) {
var _tmp = 0;
var loop = 0;
    while ( loop < group.num )
    {
var output = ( group.beings[loop] );
        if ( output != being_not )
        {
            bf_func( group, output, data );
        }
        loop++;
    }
}

function loop_being_no_sim(beings, number_beings, bf_func, data) {
var _tmp = 0;
var loop  = 0;
    while ( loop < number_beings )
    {
var output = ( beings[loop] );
        bf_func( output, data );
        loop++;
    }
}

function loop_being_no_sim_no_data(beings, number_beings, bf_func) {
var _tmp = 0;
var loop  = 0;
    while ( loop < number_beings )
    {
var output = ( beings[loop] );
        bf_func( output );
        loop++;
    }
}

function loop_add_generic(function_, general_data, read_data, write_data, count, size) {
var _tmp = 0;
    if ( size )
    {
var location = read_data;
var loop = 0;
        while ( loop < count )
        {
            if ( function_( general_data, location[loop * size], 0 ) == -1 )
            {
                break;
            }
            loop++;
        }
    }
    else
    {
        function_( general_data, read_data, write_data );
    }
}

function loop_being(group, bf_func, beings_per_thread) {
var _tmp = 0;
var loop  = 0;
var count = beings_per_thread;
var beings_per_thread_uint = beings_per_thread;
    while ( loop < group.num )
    {
var output = ( group.beings[loop] );

        if ( ( beings_per_thread_uint + loop ) >= group.num )
        {
            count = group.num - loop;
        }

        loop_add_generic( bf_func, group, output, 0, count, sizeof("simulated_being") );

        if ( count != beings_per_thread_uint )
        {
            break;
        }
        else
        {
            loop += count;
        }
    }
}

function being_from_name_loop(group, local, data) {
var _tmp = 0;
var bfns = data;
    var str = new Array( STRING_BLOCK_SIZE );

    if ( bfns.being_from_name )
    {
        return;
    }

    str = being_name_simple( local, str );

    io_lower( str, io_length( str, STRING_BLOCK_SIZE ) );

    if ( io_find( str, 0, io_length( str, STRING_BLOCK_SIZE ), bfns.name, io_length( bfns.name, STRING_BLOCK_SIZE ) ) > -1 )
    {
        bfns.being_from_name = local;
    }
}

function being_from_name(group, name) {
var _tmp = 0;
var bfns = {};
    bfns.being_from_name = 0;
    io_lower( name, io_length( name, STRING_BLOCK_SIZE ) );
    bfns.name = name;
    loop_no_thread( group, 0, being_from_name_loop, bfns );
    return bfns.being_from_name;
}

function being_set_select_name(group, name) {
var _tmp = 0;
var response = being_from_name( group, name );
    if ( response == 0 )
    {
        SHOW_ERROR( "Ape not found" );
        return;
    }
    group.select = response;
}

function being_get_select_name(group) {
var _tmp = 0;
    var name = new Array( STRING_BLOCK_SIZE );
var position = 0;
    if ( group.select == 0 )
    {
        io_string_write( name, "*** ALL APES DEAD ***", position );
    }
    else
    {
        name = being_name_simple( group.select, name );
    }
    return name;
}

function being_find_closest_loop(group, local, data) {
var _tmp = 0;
var bfcs = data;

var success = 0;
var local_dob = being_dob( local );

    if ( bfcs.older == 0 )
    {
        success = 1;
    }

    if ( ( bfcs.older == 1 ) && ( ( local_dob - AGE_OF_MATURITY ) > bfcs.actual_age ) )
    {
        success = 1;
    }

    if ( ( bfcs.older == -1 ) && ( ( bfcs.actual_age - AGE_OF_MATURITY ) > local_dob ) )
    {
        success = 1;
    }

    if ( success )
    {
var comparison = being_genetic_comparison( bfcs.genetics, being_genetics( local ), bfcs.parse_requirements );
        if ( comparison > bfcs.comparison_best )
        {
            bfcs.comparison_best = comparison;
            bfcs.return_value = local;
        }
    }

}

function being_find_closest(group, actual, parse_requirements, older) {
var _tmp = 0;
var bfcs = {};
    bfcs.parse_requirements = parse_requirements;
    bfcs.older = older;
    
    bfcs.comparison_best = 3 * sizeof("n_genetics") * CHROMOSOMES;
    bfcs.return_value = 0;
    bfcs.genetics = being_genetics( actual );
    bfcs.actual_age = being_dob( actual );

    loop_no_thread( group, actual, being_find_closest_loop, bfcs );

    return bfcs.return_value;
}

function being_find_child_loop(group, local, data) {
var _tmp = 0;
var bfcs =  data;
var comparison = being_genetic_comparison( bfcs.genetics, being_genetics( local ), -1 );
    if ( ( comparison > bfcs.comparison_best ) &&
            ( ( land_date() - being_dob( local ) ) < bfcs.max_age ) )
    {
        bfcs.comparison_best = comparison;
        bfcs.return_value = local;
    }
}

function being_find_child(group, genetics, max_age) {
var _tmp = 0;
var bfcs = {};
    bfcs.comparison_best = 0;
    bfcs.max_age = max_age;
    bfcs.genetics = genetics;
    bfcs.return_value = 0;
    loop_no_thread( group, 0, being_find_child_loop, bfcs );
    return bfcs.return_value;
}

function being_find_name_loop(group, local, data) {
var _tmp = 0;
var bfns = data;
    if ( bfns.local == 0 )
    {
        if ( being_name_comparison( local, bfns.first_gender, bfns.family ) )
        {
            bfns.local = local;
        }
    }
}

function being_find_name(group, first_gender, family) {
var _tmp = 0;
var bfns = {};
    bfns.first_gender = first_gender;
    bfns.family = family;
    bfns.local = 0;
    loop_no_thread( group, 0, being_find_name_loop, bfns );
    return bfns.local;
}

function being_affect(local, is_positive) {
var _tmp = 0;
var affect = 0;

    var i;
var local_episodic = being_episodic( local );
    if ( !local_episodic )
    {
        return affect;
    }

    for ( i = 0; i < EPISODIC_SIZE; i++ )
    {
        if ( is_positive != 0 )
        {
            if ( local_episodic[i].affect > EPISODIC_AFFECT_ZERO )
            {
                affect += ( local_episodic[i].affect ) - EPISODIC_AFFECT_ZERO;
            }
        }
        else
        {
            if ( local_episodic[i].affect < EPISODIC_AFFECT_ZERO )
            {
                affect += EPISODIC_AFFECT_ZERO - ( local_episodic[i].affect );
            }
        }
    }

    return affect;
}

function being_body_inventory_description(index) {
var _tmp = 0;
    return body_inventory_description[index % INVENTORY_SIZE];
}

function being_relationship_description(index, description) {
var _tmp = 0;
var position = 0;
    if ( index >= RELATIONSHIPS )
    {
        var index_string;
        io_number_to_string( index_string, index );
        io_three_strings( description, "ERROR: relationship out of range ", index_string, "", 1 );
        return;
    }
    io_string_write( description, relationship_description[index], position );
}

function being_inventory_string(string, location, item) {
var _tmp = 0;
    switch ( item )
    {
    case INVENTORY_BRANCH:
        io_string_write( string, "branch", location );
        break;
    case INVENTORY_ROCK:
        io_string_write( string, "rock", location );
        break;
    case INVENTORY_SHELL:
        io_string_write( string, "shell", location );
        break;
    case INVENTORY_TWIG:
        io_string_write( string, "twig", location );
        break;
    case INVENTORY_NUT_CRACKED:
        io_string_write( string, "cracked nut", location );
        break;
    case INVENTORY_GRASS:
        io_string_write( string, "piece of grass", location );
        break;
    case INVENTORY_SCRAPER:
        io_string_write( string, "scraper", location );
        break;
    case INVENTORY_SPEAR:
        io_string_write( string, "spear", location );
        break;
    case INVENTORY_FISH:
        io_string_write( string, "fish", location );
        break;
    case INVENTORY_BIRD_EGGS:
        io_string_write( string, "bird eggs", location );
        break;
    case INVENTORY_LIZARD_EGGS:
        io_string_write( string, "lizard eggs", location );
        break;
    case INVENTORY_CHILD:
    case INVENTORY_WOUND:
    case INVENTORY_GROOMED:
    default:
        io_string_write( string, "thing being carried", location );
        break;
    }
}

function being_social_event_string(string, location, event_type, name_str) {
var _tmp = 0;
    switch ( event_type )
    {
    case EVENT_MATE:
        io_string_write( string, "Mated with ", location );
        break;
    case EVENT_SEEK_MATE:
        io_string_write( string, "Searched for ", location );
        break;
    
    case EVENT_GROOMED:
        io_string_write( string, "Groomed by ", location );
        break;
    case EVENT_CHAT:
        io_string_write( string, "Chatted with ", location );
        break;
    case EVENT_BIRTH:
        io_string_write( string, "Gave birth to ", location );
        break;
    case EVENT_HURLED:
        io_string_write( string, "Hurled a rock at ", location );
        break;
    case EVENT_HURLED_BY:
        io_string_write( string, "Hit by a rock hurled by ", location );
        break;

    case EVENT_HIT:
        io_string_write( string, "Hit ", location );
        break;
    case EVENT_HIT_BY:
        io_string_write( string, "Hit by ", location );
        break;
    case EVENT_CARRIED:
        io_string_write( string, "Carried ", location );
        break;
    case EVENT_CARRIED_BY:
        io_string_write( string, "Carried by ", location );
        break;
    case EVENT_SUCKLED:
        io_string_write( string, "Suckled ", location );
        break;
    case EVENT_SUCKLED_BY:
        io_string_write( string, "Suckled by ", location );
        break;
    case EVENT_WHACKED:
        io_string_write( string, "Whacked ", location );
        break;
    case EVENT_WHACKED_BY:
        io_string_write( string, "Whacked by ", location );
        break;
    case EVENT_HUGGED:
        io_string_write( string, "Hugged ", location );
        break;
    case EVENT_HUGGED_BY:
        io_string_write( string, "Hugged by ", location );
        break;
    case EVENT_PRODDED:
        io_string_write( string, "Prodded ", location );
        break;
    case EVENT_PRODDED_BY:
        io_string_write( string, "Prodded by ", location );
        break;
    case EVENT_GIVEN:
        io_string_write( string, "Given ", location );
        break;
    case EVENT_GIVEN_BY:
        io_string_write( string, "Given by ", location );
        break;
    case EVENT_POINT:
        io_string_write( string, "Pointed to ", location );
        break;
    case EVENT_POINTED:
        io_string_write( string, "Pointed to by ", location );
        break;
    case EVENT_SMILED:
        io_string_write( string, "Smiled at ", location );
        break;
    case EVENT_SMILED_BY:
        io_string_write( string, "Smiled at by ", location );
        break;
    case EVENT_TICKLED:
        io_string_write( string, "Tickled ", location );
        break;
    case EVENT_TICKLED_BY:
        io_string_write( string, "Tickled by ", location );
        break;
    case EVENT_GLOWERED:
        io_string_write( string, "Glowered at ", location );
        break;
    case EVENT_GLOWERED_BY:
        io_string_write( string, "Glowered at by ", location );
        break;
    case EVENT_PATTED:
        io_string_write( string, "Patted ", location );
        break;
    case EVENT_PATTED_BY:
        io_string_write( string, "Patted by ", location );
        break;
    default:
    {
        var number_str;
        io_number_to_string( number_str, event_type );

        io_string_write( string, "Erroneous action (", location );
        io_string_write( string, number_str, location );
        io_string_write( string, ") with ", location );
        break;
    }
    }
    io_string_write( string, "*", location );
    io_string_write( string, name_str, location );
    io_string_write( string, "*", location );
}

function being_remains_init(remains) {
var _tmp = 0;
    remains.count = 0;
    remains.location = 0;
}

function being_remains(group, dead) {
var _tmp = 0;
var remains  = ( group.remains );
var location = remains.location;

    remains.bodies[location].location[0] = dead.delta.location[0];
    remains.bodies[location].location[1] = dead.delta.location[1];
    remains.location = ( remains.location + 1 ) % NUMBER_OF_BODIES;

    if ( remains.count <= NUMBER_OF_BODIES )
    {
        remains.count++;
    }
}

function episode_description(local_being, index, description) {
var _tmp = 0;
var str = [0];
var string_index = 0;
var social = 0;

    var str2, name_str;
    var local_episodic;
    var days_elapsed, time_elapsed;

    local_episodic = being_episodic( local_being );

    if ( local_episodic == 0 )
    {
        return SHOW_ERROR( "No episodic description" );
    }

    if ( ( local_episodic[index].event > 0 ) &&
            being_name_comparison( local_being, local_episodic[index].first_name[0], local_episodic[index].family_name[0] ) )
    {
        being_name_byte2( local_episodic[index].first_name[BEING_MET], local_episodic[index].family_name[BEING_MET], name_str );

        if ( local_episodic[index].event & ( EVENT_INTENTION ) )
        {
            io_string_write( str, "Intends ", string_index );
        }

        switch ( local_episodic[index].event & ( EVENT_INTENTION - 1 ) )
        {
        case EVENT_EAT:
        {
            io_string_write( str, "Was eating ", string_index );
            switch ( local_episodic[index].food )
            {
            case FOOD_VEGETABLE:
            {
                io_string_write( str, "vegetation", string_index );
                break;
            }
            case FOOD_FRUIT:
            {
                io_string_write( str, "fruit", string_index );
                break;
            }
            case FOOD_SHELLFISH:
            {
                io_string_write( str, "shellfish", string_index );
                break;
            }
            case FOOD_SEAWEED:
            {
                io_string_write( str, "seaweed", string_index );
                break;
            }
            case FOOD_BIRD_EGGS:
            {
                io_string_write( str, "bird eggs", string_index );
                break;
            }
            case FOOD_LIZARD_EGGS:
            {
                io_string_write( str, "lizard eggs", string_index );
                break;
            }
            }
            break;
        }
        case EVENT_SWIM:
        {
            io_string_write( str, "Went swimming", string_index );
            break;
        }
        case EVENT_GROOM: // this appears to be a duplicate
        {
            io_string_write( str, "Groomed *", string_index );
            io_string_write( str, name_str, string_index );
            io_string_write( str, "*'s ", string_index );
            io_string_write( str, being_body_inventory_description( local_episodic[index].arg ), string_index );

            social = 1;
            break;
        }
        case EVENT_SHOUT:
        {
            io_string_write( str, "Shouted ", string_index );
            break;
        }
        case EVENT_FISH:
        {
            io_string_write( str, "Caught a fish ", string_index );
            break;
        }
        case EVENT_CHEW:
        {
            io_string_write( str, "Chewing ", string_index );
            if ( local_episodic[index].arg & INVENTORY_GRASS )
            {
                io_string_write( str, "grass ", string_index );
            }
            else
            {
                if ( local_episodic[index].arg & INVENTORY_TWIG )
                {
                    io_string_write( str, "twig ", string_index );
                }
                else
                {
                    if ( local_episodic[index].arg & INVENTORY_FISH )
                    {
                        io_string_write( str, "fish ", string_index );
                    }
                    else
                    {
                        if ( local_episodic[index].arg & INVENTORY_NUT_CRACKED )
                        {
                            io_string_write( str, "a cracked nut ", string_index );
                        }
                        else
                        {
                            {
                                if ( local_episodic[index].arg & INVENTORY_BIRD_EGGS )
                                {
                                    io_string_write( str, "birds eggs ", string_index );
                                }
                                else
                                {
                                    if ( local_episodic[index].arg & INVENTORY_LIZARD_EGGS )
                                    {
                                        io_string_write( str, "lizard eggs ", string_index );
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if ( local_episodic[index].arg & 1 )
            {
                io_string_write( str, "held in right hand ", string_index );
            }
            else
            {
                io_string_write( str, "held in left hand ", string_index );
            }
            break;
        }
        case EVENT_DRAG:
            io_string_write( str, "Dragged a ", string_index );
            being_inventory_string( str, string_index, local_episodic[index].arg );
            break;
        case EVENT_BRANDISH:
            io_string_write( str, "Waved a ", string_index );
            being_inventory_string( str, string_index, local_episodic[index].arg );
            break;
        case EVENT_DROP:
            io_string_write( str, "Dropped a ", string_index );
            being_inventory_string( str, string_index, local_episodic[index].arg );
            break;
        case EVENT_PICKUP:
            io_string_write( str, "Picked up a ", string_index );
            being_inventory_string( str, string_index, local_episodic[index].arg );
            break;
        default:
            being_social_event_string( str, string_index, local_episodic[index].event & ( EVENT_INTENTION - 1 ), name_str );
            social = 1;
            break;
        }

        if ( string_index == 0 )
        {
            return SHOW_ERROR( "No string in episodic description" );
        }

        days_elapsed = land_date() - local_episodic[index].space_time.date;
        if ( days_elapsed == 0 )
        {
            time_elapsed = land_time() - local_episodic[index].space_time.time;

            if ( time_elapsed < 60 )
            {
                if ( time_elapsed == 0 )
                {
                    io_string_write( str, " now", string_index );
                }
                else if ( time_elapsed == 1 )
                {
                    io_string_write( str, " a minute ago", string_index );
                }
                else if ( time_elapsed < 5 )
                {
                    io_string_write( str, " a few minutes ago", string_index );
                }
                else
                {
                    var time_elapsed_string;
                    io_number_to_string( time_elapsed_string, time_elapsed );
                    io_three_strings( str2, " ", time_elapsed_string, " minutes ago", 0 );
                    io_string_write( str, str2, string_index );
                }
            }
            else
            {
                if ( time_elapsed < 120 )
                {
                    io_string_write( str, " an hour ago", string_index );
                }
                else
                {
                    var time_elapsed_string;
                    io_number_to_string( time_elapsed_string, time_elapsed / 60 );
                    io_three_strings( str2, " ", time_elapsed_string, " hours ago", 0 );
                    io_string_write( str, str2, string_index );
                }
            }
        }
        else
        {
            if ( days_elapsed == 1 )
            {
                io_string_write( str, " yesterday", string_index );
            }
            else
            {
                var days_elapsed_string;
                io_number_to_string( days_elapsed_string, days_elapsed );
                io_three_strings( str2, " ", days_elapsed_string, " days ago", 0 );
                io_string_write( str, str2, string_index );
            }
        }
    }

    str[string_index] = 0;

    string_index = 0;

    io_string_write( description, str, string_index );

    return social;
}

function being_awake(local) {
var _tmp = 0;
    if ( local )
    {
        if ( being_energy_less_than( local, BEING_DEAD + 1 ) )
        {
            return FULLY_ASLEEP;
        }

        
        if ( IS_NIGHT( land_time() ) == 0 )
        {
            return FULLY_AWAKE;
        }

        

        
        {
            var location = vect2_new();

            being_space( local, location );
            spacetime_convert_to_map( location );

            if ( WATER_TEST( land_location_vect( location ), land_tide_level() ) )
            {
                return FULLY_AWAKE;
            }
        }
        

        if ( being_energy_less_than( local, BEING_HUNGRY + 1 ) )
        {

            being_register_movement( local, "set slightly awake due to energy" );

            return SLIGHTLY_AWAKE;
        }

        

        if ( being_speed( local ) > 0 )
        {

            being_register_movement( local, "set slightly awake due to speed" );

            return SLIGHTLY_AWAKE;
        }

        
    }
    return FULLY_ASLEEP;
}

function being_cycle_universal(local) {
var _tmp = 0;
var immune_energy_used = immune_response( local.immune_system, being_honor_immune( local ), being_energy( local ) );

    NA_ASSERT( ( immune_energy_used >= 0 ), "Positive energy added back from immune response" );

    if ( immune_energy_used > 0 )
    {
        being_energy_delta( local, 0 - immune_energy_used );
    }

    if ( ( local.delta.awake == 0 ) && local )
    {
        being_set_state( local, BEING_STATE_ASLEEP );
        being_reset_drive( local, DRIVE_FATIGUE );
    }
}

function being_create_family_links(mother, child, group) {
var _tmp = 0;
    var i, j, index;
    var parent = [0];
    var sibling;
    var parent_relation = new Array(6);
    var child_relation = new Array(6);
    var sibling_relation;
    var parent_social_graph;

    if ( mother == 0 )
    {
        return;
    }

    
    parent[0] = mother;
    parent[1] = being_find_name( group, mother.changes.father_name[0], mother.changes.father_name[1] );

    parent_relation[0] = RELATIONSHIP_DAUGHTER;
    parent_relation[1] = RELATIONSHIP_DAUGHTER;
    parent_relation[2] = RELATIONSHIP_GRANDDAUGHTER;
    parent_relation[3] = RELATIONSHIP_GRANDDAUGHTER;
    parent_relation[4] = RELATIONSHIP_GRANDDAUGHTER;
    parent_relation[5] = RELATIONSHIP_GRANDDAUGHTER;

    child_relation[0] = RELATIONSHIP_MOTHER;
    child_relation[1] = RELATIONSHIP_MOTHER;
    child_relation[2] = RELATIONSHIP_MATERNAL_GRANDMOTHER;
    child_relation[3] = RELATIONSHIP_MATERNAL_GRANDMOTHER;
    child_relation[4] = RELATIONSHIP_PATERNAL_GRANDMOTHER;
    child_relation[5] = RELATIONSHIP_PATERNAL_GRANDMOTHER;

    
    for ( j = 0; j < 2; j++ ) 
    {
        if ( parent[j] )
        {
            
            parent_social_graph = being_social( parent[j] );
            if ( parent_social_graph )
            {
                for ( i = 0; i < 2; i++ ) 
                {
                    parent[2 + ( j * 2 ) + i] = 0;
                    
                    index = social_get_relationship( parent[j], ( RELATIONSHIP_MOTHER + i ) );
                    if ( ( index > -1 ) && ( parent_social_graph != 0 ) )
                    {
                        
                        parent[2 + ( j * 2 ) + i] =
                            being_find_name( group,
                                             parent_social_graph[index].first_name[BEING_MET],
                                             parent_social_graph[index].family_name[BEING_MET] );
                    }
                }
            }
        }
    }

    
    sibling_relation = RELATIONSHIP_BROTHER;
    if ( FIND_SEX( GET_I( child ) ) == SEX_FEMALE )
    {
        sibling_relation = RELATIONSHIP_SISTER;
    }

    for ( j = 0; j < 2; j++ )
    {
        
        if ( parent[j] )
        {
            parent_social_graph = being_social( parent[j] );
            if ( parent_social_graph )
            {
                for ( i = 1; i < SOCIAL_SIZE_BEINGS; i++ )
                {
                    if ( ( parent_social_graph[i].relationship == RELATIONSHIP_SON ) ||
                            ( parent_social_graph[i].relationship == RELATIONSHIP_DAUGHTER ) )
                    {
                        sibling = being_find_name( group, parent_social_graph[i].first_name[BEING_MET], parent_social_graph[i].family_name[BEING_MET] );
                        if ( sibling != 0 )
                        {
                            if ( parent_social_graph[i].relationship == RELATIONSHIP_SON )
                            {
                                social_set_relationship( group, child, RELATIONSHIP_BROTHER, sibling );
                            }
                            else
                            {
                                social_set_relationship( group, child, RELATIONSHIP_SISTER, sibling );
                            }
                            social_set_relationship( group, sibling, sibling_relation, child );
                        }
                    }
                }
            }
        }
    }

    
    for ( i = 0; i < 6; i++ )
    {
        if ( parent[i] == 0 )
        {
            continue;
        }

        
        if ( FIND_SEX( GET_I( child ) ) == SEX_FEMALE )
        {
            social_set_relationship( group, parent[i], parent_relation[i], child );
        }
        else
        {
            social_set_relationship( group, parent[i], parent_relation[i] + 1, child );
        }

        if ( i % 2 == 0 )
        {
            social_set_relationship( group, child, child_relation[i], parent[i] );
        }
        else
        {
            social_set_relationship( group, child, child_relation[i] + 1, parent[i] );
        }
    }

}

function being_set_goal_mate(local, first_name, family_name) {
var _tmp = 0;
    local.delta.goal[0] = GOAL_MATE;
    local.delta.goal[1] = first_name;
    local.delta.goal[2] = family_name;
    local.delta.goal[3] = GOAL_TIMEOUT;
}

function being_set_goal_none(local) {
var _tmp = 0;
    local.delta.goal[0] = GOAL_NONE;
}

function being_set_goal_location(local, lx, ly) {
var _tmp = 0;
    local.delta.goal[0] = GOAL_LOCATION;
    local.delta.goal[1] = lx;
    local.delta.goal[2] = ly;
    local.delta.goal[3] = GOAL_TIMEOUT;
}

function being_check_goal(local, goal) {
var _tmp = 0;
    return ( local.delta.goal[0] == goal );
}

function being_goal_cycle(local) {
var _tmp = 0;
    
    if ( local.delta.goal[3] > 0 )
    {
        local.delta.goal[3]--;
    }
    else
    {
        
        being_set_goal_none( local );
    }
}

function being_follow_loop1(group, other, data) {
var _tmp = 0;
var nearest = data;
    var difference_vector = vect2_new();

    
    if ( ( FIND_SEX( GET_I( other ) ) != FIND_SEX( GET_I( nearest.local ) ) ) &&
            being_name_comparison( other, nearest.local.delta.goal[1], nearest.local.delta.goal[2] ) )
    {
        var other_location = vect2_new();
        being_delta( nearest.local, other, difference_vector );
        being_space( other, other_location );

        if ( being_line_of_sight( nearest.local, other_location ) ) 
        {
var compare_distance = vect2_dot( difference_vector, difference_vector, 1, 1 );
            if ( compare_distance < nearest.opposite_sex_distance )
            {
                nearest.opposite_sex = other;
                nearest.opposite_sex_distance = compare_distance;
            }
        }
    }
}

function being_follow_loop2(group, other, data) {
var _tmp = 0;
var nearest = data;
    var difference_vector = vect2_new();

    
    if ( being_name_comparison( other,
                                nearest.local_social.first_name[BEING_MET],
                                nearest.local_social.family_name[BEING_MET] ) )
    {
        

        var other_location = vect2_new();
        being_delta( nearest.local, other, difference_vector );
        being_space( other, other_location );
        if ( being_line_of_sight( nearest.local, other_location ) )
        {
var compare_distance = vect2_dot( difference_vector, difference_vector, 1, 1 );
            if ( FIND_SEX( GET_I( other ) ) != FIND_SEX( GET_I( nearest.local ) ) )
            {
                if ( compare_distance < nearest.opposite_sex_distance )
                {
                    nearest.opposite_sex = other;
                    nearest.opposite_sex_distance = compare_distance;
                }
            }
            else
            {
                if ( compare_distance < nearest.same_sex_distance )
                {
                    nearest.same_sex = other;
                    nearest.same_sex_distance = compare_distance;
                }
            }
        }
    }

}

function being_follow(group, local, nearest) {
var _tmp = 0;
    
    var local_social_graph;
    var social_graph_index;

    nearest.local = local;
    nearest.opposite_sex_distance = 0xffffffff;
    nearest.same_sex_distance = 0xffffffff;
    nearest.opposite_sex = 0;
    nearest.same_sex = 0;

    
    if ( being_check_goal( local, GOAL_MATE ) )
    {
        loop_no_thread( group, local, being_follow_loop1, nearest );
        if ( nearest.opposite_sex != 0 )
        {
            return;
        }
    }

    local_social_graph = being_social( local );
    if ( local_social_graph == 0 )
    {
        return;
    }

    
    social_graph_index = being_attention( local, ATTENTION_ACTOR );

    nearest.local_social = local_social_graph[social_graph_index];

    
    if ( ( social_graph_index > 0 ) &&
            ( local_social_graph[social_graph_index].entity_type == ENTITY_BEING ) &&
            ( !SOCIAL_GRAPH_ENTRY_EMPTY( local_social_graph, social_graph_index ) ) )
    {
        loop_no_thread( group, local, being_follow_loop2, nearest );
    }
}

function being_listen_loop_no_sim(other, data) {
var _tmp = 0;
var bls = data;
    var difference_vector = vect2_new();
    var compare_distance;

    being_delta( bls.local, other, difference_vector );
    compare_distance = vect2_dot( difference_vector, difference_vector, 1, 1 );
    
    if ( ( being_state( other )&BEING_STATE_SHOUTING ) &&
            ( compare_distance < SHOUT_RANGE ) &&
            ( other.changes.shout[SHOUT_VOLUME] > bls.max_shout_volume ) )
    {
        bls.max_shout_volume = other.changes.shout[SHOUT_VOLUME];
        bls.local.changes.shout[SHOUT_HEARD] = other.changes.shout[SHOUT_CONTENT];
        bls.local.changes.shout[SHOUT_FAMILY0] = being_family_first_name( other );
        bls.local.changes.shout[SHOUT_FAMILY1] = being_family_second_name( other );
    }
}

function being_listen(group, local_being, data) {
var _tmp = 0;
    var bls = {};

    if ( local_being.delta.awake == 0 )
    {
        return;
    }

    bls.max_shout_volume = 127;
    bls.local = local_being;
    
    if ( local_being.changes.shout[SHOUT_CTR] > 0 )
    {
        local_being.changes.shout[SHOUT_CTR]--;
    }
    loop_being_no_sim( group.beings, group.num, being_listen_loop_no_sim, bls );
}

function being_closest_loop(group, test_being, data) {
var _tmp = 0;
var nearest = data;
    var difference_vector = vect2_new();
    var compare_distance;
    var location_test = vect2_new();
    being_delta( nearest.local, test_being, difference_vector );
    compare_distance = vect2_dot( difference_vector, difference_vector, 1, 1 );

    if ( FIND_SEX( GET_I( test_being ) ) != FIND_SEX( GET_I( nearest.local ) ) )
    {
        if ( compare_distance < nearest.opposite_sex_distance )
        {
            being_space( test_being, location_test );
            
            if ( being_line_of_sight( nearest.local, location_test ) )
            {
                nearest.opposite_sex_distance = compare_distance;
                nearest.opposite_sex = test_being;
            }
        }
    }
    else
    {
        if ( compare_distance < nearest.same_sex_distance )
        {
            being_space( test_being, location_test );

            if ( being_line_of_sight( nearest.local, location_test ) )
            {
                nearest.same_sex_distance = compare_distance;
                nearest.same_sex = test_being;
            }
        }
    }
}

function being_closest(group, local, nearest) {
var _tmp = 0;
    nearest.local = local;
    nearest.opposite_sex_distance = 0xffffffff;
    nearest.same_sex_distance = 0xffffffff;
    nearest.opposite_sex = 0;
    nearest.same_sex = 0;
    loop_no_thread( group, local, being_closest_loop, nearest );
}

function being_interact(group, local, other_being, other_being_distance, awake, state, speed, opposite_sex) {
var _tmp = 0;
    if ( other_being != 0 )
    {
var today_days   = land_date();
var birth_days   = being_dob( local );
var local_is_female = FIND_SEX( GET_I( local ) );

        var delta_vector = vect2_new();

        
var familiarity = 0;
var being_index = social_network( group, local, other_being, other_being_distance );

        being_delta( local, other_being, delta_vector );

        if ( being_index > -1 )
        {
var local_social_graph = being_social( local );
            if ( local_social_graph )
            {
                familiarity = local_social_graph[being_index].familiarity;
            }
        }

        being_facing_towards( local, delta_vector );

        if ( ( birth_days + AGE_OF_MATURITY ) < today_days )
        {
            if ( social_groom( group, local, other_being, other_being_distance, awake, familiarity ) )
            {
                state |= BEING_STATE_GROOMING;
speed = 0;
                being_set_speed( other_being, 0 );
            }
            else
            {
                
                if ( ( other_being_distance < SQUABBLE_RANGE ) && ( ( being_dob( other_being ) + AGE_OF_MATURITY ) < today_days ) )
                {
                    var squabble_val;
                    being_set_speed( local, speed );

                    if ( speed == 0 )
                    {
                        being_register_movement( local, "speed is zero" );
                    }

                    squabble_val = social_squabble( local, other_being, other_being_distance, local_is_female, group );
                    if ( squabble_val != 0 )
                    {
                        state |= squabble_val;
speed = being_speed( local );
                    }
                }
            }

        }
        if ( ( other_being_distance < SOCIAL_RANGE ) && ( being_index > -1 ) )
        {
            
            if ( opposite_sex != 0 )
            {
                state |= social_mate( local, other_being, being_index, other_being_distance, group );
            }
state |= social_chat( local, other_being, being_index, group );
        }
    }
}

function being_index_loop(group, local_being, data) {
var _tmp = 0;
var bils =  data;

    if ( bils.return_value != -1 )
    {
        return;
    }

    if ( local_being == bils.being )
    {
        bils.return_value = bils.counter;
    }
    else
    {
        bils.counter++;
    }
}

function being_index(group, local) {
var _tmp = 0;
var value = {};

    value.return_value = -1;
    value.being = local;
    value.counter = 0;

    loop_no_thread( group, 0, being_index_loop, value );
    return value.return_value;
}

function being_territory_index(local) {
var _tmp = 0;
    var territory_index =
        APESPACE_TO_TERRITORY( being_location_y( local ) ) * TERRITORY_DIMENSION +
        APESPACE_TO_TERRITORY( being_location_x( local ) );

    if ( local.events.territory[territory_index].familiarity < 65534 )
    {
        local.events.territory[territory_index].familiarity++;
    }
    else
    {
        
        for ( territory_index = 0; territory_index < TERRITORY_AREA; territory_index++ )
        {
            local.events.territory[territory_index].familiarity >>= 2;
        }
    }
}

function being_temporary_speed(local, test_land, az) {
var _tmp = 0;
    var location_vector = vect2_new();
    var facing_vector = vect2_new();
    var slope_vector = vect2_new();
    var looking_vector = vect2_new();

    being_space( local, location_vector );

    being_facing_vector( local, facing_vector, 4 );
    az = land_vect2( slope_vector, az, location_vector );
    vect2_add( looking_vector, location_vector, facing_vector );
    spacetime_convert_to_map( looking_vector );
test_land = ( WATER_TEST( land_location_vect( looking_vector ), land_tide_level() ) != 0 );

    {
var delta_z = vect2_dot( slope_vector, facing_vector, 1, 24 );
var tmp_speed = ( ( delta_z + 280 ) >> 4 );

        if ( tmp_speed == 0 )
        {
            being_register_movement( local, "temp speed zero in setting temp speed" );
        }

        return { speed: tmp_speed, test_land: test_land, az: az };
    }
}

function being_conception_child_mass(group, local, loc_state) {
var _tmp = 0;
var birth_days = being_dob( local );
var today_days = land_date();
var child_mass = 0;
var carrying_child = 0;
var genetics = being_genetics( local );

    
    if ( ( being_pregnant( local ) != 0 ) &&
            ( ( being_pregnant( local ) + GESTATION_DAYS + CONCEPTION_INHIBITION_DAYS ) < today_days ) )
    {
        
        local.changes.date_of_conception = 0;
    }

    if ( ( loc_state & ( BEING_STATE_AWAKE | BEING_STATE_SWIMMING ) ) == BEING_STATE_AWAKE )
    {
var conception_days = being_pregnant( local ) ;
        if ( conception_days > 0 )
        {
var gestation_days = conception_days + GESTATION_DAYS;
            if ( today_days > gestation_days )
            {
                
var being_child = being_find_child( group, genetics, CARRYING_DAYS );

                
                if ( being_child == 0 )
                {
                    if ( ( group.num + 1 ) < group.max )
                    {
                        being_child = ( group.beings[group.num] );

                        if ( being_init( group.beings, group.num, being_child, local, 0 ) == 0 )
                        {

                            episodic_close( local, being_child, EVENT_BIRTH, AFFECT_BIRTH, 0 );

                            being_create_family_links( local, being_child, group );
                            if ( group.ext_birth != 0 )
                            {
                                group.ext_birth( being_child, local, group );
                            }
                            group.num++;
                        }
                    }
                }
                else
                {
                    
var carrying_days = conception_days + GESTATION_DAYS + CARRYING_DAYS;
                    if ( today_days < carrying_days )
                    {
                        if ( !( ( local.changes.inventory[BODY_FRONT] & INVENTORY_CHILD ) ||
                                ( local.changes.inventory[BODY_BACK] & INVENTORY_CHILD ) ) )
                        {
                            local.changes.inventory[BODY_BACK] |= INVENTORY_CHILD;
                            being_set_attention( local, ATTENTION_BODY, BODY_BACK );
                        }
                        carrying_child = 1;

                        being_set_location( being_child, being_location( local ) );

                        child_mass = GET_M( being_child );

                        episodic_close( local, being_child, EVENT_CARRIED, AFFECT_CARRYING, 0 );
                        episodic_close( being_child, local, EVENT_CARRIED_BY, AFFECT_CARRIED, 0 );

                    }
                }
            }
            else
            {
                
                child_mass = ( today_days - conception_days ) * BIRTH_MASS / GESTATION_DAYS;
            }
        }

        
        if ( ( birth_days + WEANING_DAYS ) > today_days )
        {
var mother = being_find_closest( group, local, 1, 1 );
            if ( mother != 0 )
            {
                
                var mother_vector = vect2_new();

                being_delta( mother, local, mother_vector );

                being_facing_towards( local, mother_vector );

                
                if ( ( loc_state & BEING_STATE_HUNGRY ) != 0 )
                {
var distance = vect2_dot( mother_vector, mother_vector, 1, 1 );
                    if ( distance < SUCKLING_MAX_SEPARATION )
                    {
                        
                        if ( mother.changes.inventory[BODY_BACK] & INVENTORY_CHILD )
                        {
                            mother.changes.inventory[BODY_BACK] -= INVENTORY_CHILD;
                        }
                        mother.changes.inventory[BODY_FRONT] |= INVENTORY_CHILD;
                        being_set_attention( mother, ATTENTION_BODY, BODY_FRONT );
                        
                        if ( mother.changes.inventory[BODY_FRONT] & INVENTORY_GROOMED )
                        {
                            mother.changes.inventory[BODY_FRONT] -= INVENTORY_GROOMED;
                        }
                        
                        if ( being_energy_less_than( mother, BEING_HUNGRY ) == 0 )
                        {
                            
                            being_energy_delta( mother, 0 - SUCKLING_ENERGY );
                            

                            being_energy_delta( local, SUCKLING_ENERGY );

                            
                            loc_state |= BEING_STATE_SUCKLING;
                            
                            immune_seed( mother.immune_system, local.immune_system );

                            episodic_close( mother, local, EVENT_SUCKLED, AFFECT_SUCKLING, 0 );
                            episodic_close( local, mother, EVENT_SUCKLED_BY, AFFECT_SUCKLING, 0 );

                        }
                    }
                }
            }
        }
    }

    
    if ( ( carrying_child == 0 ) && ( FIND_SEX( GET_I( local ) ) == SEX_FEMALE ) )
    {
        if ( local.changes.inventory[BODY_FRONT] & INVENTORY_CHILD )
        {
            local.changes.inventory[BODY_FRONT] -= INVENTORY_CHILD;
        }
        if ( local.changes.inventory[BODY_BACK] & INVENTORY_CHILD )
        {
            local.changes.inventory[BODY_BACK] -= INVENTORY_CHILD;
        }
    }
    return child_mass;
}

function being_state_find(local, az, loc_s) {
var _tmp = 0;
var loc_state  = BEING_STATE_ASLEEP;
var awake = local.delta.awake;


    
    if ( WATER_TEST( az, land_tide_level() ) != 0 )
    {
        loc_state |= BEING_STATE_SWIMMING;
    }


    if ( awake != FULLY_ASLEEP )
    {
        loc_state |= BEING_STATE_AWAKE;
    }

    if ( loc_s != 0 )
    {
        loc_state |= BEING_STATE_MOVING;
    }

    {
var hungry = being_energy_less_than( local, BEING_HUNGRY );

        if ( ( loc_state & ( BEING_STATE_AWAKE | BEING_STATE_SWIMMING | BEING_STATE_MOVING ) ) == BEING_STATE_AWAKE )
        {
            hungry = being_energy_less_than( local, BEING_FULL );

            being_register_movement( local, "is eating path" );

        }

        if ( hungry != 0 )
        {

            being_register_movement( local, "is hungry" );

            loc_state |= BEING_STATE_HUNGRY;
        }
    }
    return loc_state;
}

function being_not_swimming(group, local, tmp_speed, nearest, loc_s, loc_state) {
var _tmp = 0;
var genetics = being_genetics( local );
tmp_speed = ( tmp_speed * ( GENE_SPEED( genetics ) + 8 ) ) >> 3;

    
    being_follow( group, local, nearest );
    if ( nearest.opposite_sex == 0 )
    {
        
        being_closest( group, local, nearest );
    }

    
    if ( being_drive( local, DRIVE_SOCIAL ) > SOCIAL_THRESHOLD( local ) )
    {
var awake = local.delta.awake;

        being_interact( group,
                        local,
                        nearest.same_sex, nearest.same_sex_distance,
                        awake, loc_state,
                        loc_s, 0 );

        being_interact( group,
                        local,
                        nearest.opposite_sex, nearest.opposite_sex_distance,
                        awake, loc_state,
                        loc_s, 1 );
    }
}

function being_swimming(group, local, tmp_speed) {
var _tmp = 0;
    var loop;
var genetics = being_genetics( local );

    being_turn_away_from_water( local );

    
    being_set_posture( local, 0 );

    

    for ( loop = 0; loop < INVENTORY_SIZE; loop++ )
    {
        if ( !( ( loop == BODY_HEAD ) || ( loop == BODY_BACK ) ) )
        {
            local.changes.inventory[loop] = 0;
        }
    }
tmp_speed = ( tmp_speed * ( GENE_SWIM( genetics ) + 8 ) ) >> 4;

    

    episodic_self( local, EVENT_SWIM, AFFECT_GROOM, being_energy( local ) );

    
    being_remove_parasites( local, 1 );
}

function being_mass_calculation(group, local, loc_state) {
var _tmp = 0;
var loc_h      = being_height( local );
var child_mass = being_conception_child_mass( group, local, loc_state );
    
var fat_mass = GET_BODY_FAT( local );
    if ( fat_mass > BEING_MAX_MASS_FAT_G )
    {
        fat_mass = BEING_MAX_MASS_FAT_G;
    }
    GET_M( local ) = ( ( BEING_MAX_MASS_G * loc_h / BEING_MAX_HEIGHT ) + fat_mass + child_mass );
}

function being_genetic_wandering(local, nearest) {
var _tmp = 0;
var genetics = being_genetics( local );

    if ( being_check_goal( local, GOAL_NONE ) &&
            ( nearest.opposite_sex == 0 ) &&
            ( nearest.same_sex == 0 ) &&
            ( being_random( local ) < 1000 + 3600 * GENE_STAGGER( genetics ) ) )
    {
var wander = math_spread_byte( being_random( local ) & 7 );
        being_wander( local, wander );
    }
}

function being_calculate_speed(local, tmp_speed, loc_state) {
var _tmp = 0;
var loc_s      = being_speed( local );

    if ( tmp_speed > 39 )
    {
        tmp_speed = 39;
    }
    if ( tmp_speed < 0 )
    {
        tmp_speed = 0;
    }

    if ( ( local.delta.awake != FULLY_AWAKE ) || ( ( loc_state & ( BEING_STATE_HUNGRY | BEING_STATE_NO_FOOD ) ) == BEING_STATE_HUNGRY ) )
    {
        if ( ( loc_state & BEING_STATE_SWIMMING ) != 0 )
        {
            tmp_speed = ( being_energy( local ) >> 7 );
        }
        else
        {
            if ( ( loc_state & BEING_STATE_NO_FOOD ) != BEING_STATE_NO_FOOD )
            {
                tmp_speed = 0;

                being_register_movement( local, "not fully awake and hungry not swimming" );

            }
        }
    }

    if ( tmp_speed > loc_s )
    {
        loc_s++;
    }
    if ( tmp_speed < loc_s )
    {
        loc_s--;
    }
    if ( tmp_speed < loc_s )
    {
        loc_s--;
    }
    if ( tmp_speed < loc_s )
    {
        loc_s--;
    }

    being_set_speed( local, loc_s );
}

function being_cycle_awake(group, local) {
var _tmp = 0;
var loc_s      = being_speed( local );
var loc_h      = being_height( local );
var birth_days = being_dob( local );
var today_days = land_date();

    
    
    var az = 0;
    var nearest = {};
var test_land = 1;
var temp_speed_result = being_temporary_speed( local, test_land, az );
var tmp_speed = temp_speed_result.speed;
test_land = temp_speed_result.test_land;
az = temp_speed_result.az;
var loc_state = being_state_find( local, az, loc_s );

    nearest.opposite_sex = 0;
    nearest.same_sex = 0;

    
    if ( ( ( loc_state & BEING_STATE_SWIMMING ) != 0 ) || test_land )
    {
        being_swimming( group, local, tmp_speed );
    }
    else
    {
        being_not_swimming( group, local, tmp_speed, nearest, loc_s, loc_state );
    }

    if ( tmp_speed == 0 )
    {
        being_register_movement( local, "temp speed zero" );
    }

    if ( ( loc_state & ( BEING_STATE_SWIMMING | BEING_STATE_GROOMING | BEING_STATE_ATTACK | BEING_STATE_SHOWFORCE ) ) == 0 )
    {
        if ( ( loc_state & BEING_STATE_HUNGRY ) == BEING_STATE_HUNGRY )
        {
            if ( loc_s == 0 )
            {
                
                var food_type;
var energy = food_eat( being_location_x( local ), being_location_y( local ), az, food_type, local );


                {
                    var energy_string;
                    sprintf( energy_string, "energy delta is %ld tmp_speed is %ld", energy, tmp_speed );
                    being_register_movement( local, energy_string );
                }

                if ( energy != 0 )
                {

                    
                    episodic_food( local, energy, food_type );


                    being_energy_delta( local, energy );
                    being_reset_drive( local, DRIVE_HUNGER );
                    loc_state |= BEING_STATE_EATING;
                    
                    if ( loc_h < BEING_MAX_HEIGHT )
                    {
                        if ( ( birth_days + AGE_OF_MATURITY ) > today_days )
                        {
                            loc_h += ENERGY_TO_GROWTH( local, energy );
                        }
                    }
                }
                else
                {
                    loc_state |= BEING_STATE_NO_FOOD;

                    {
                        being_register_movement( local, "no food state set" );
                    }

                }
            }
        }
        else
        {
            
            social_goals( local );
            if ( loc_s == 0 )
            {
                loc_s = 10;
            }
        }
    }

    being_set_height( local, loc_h );
    being_set_state( local, loc_state );
    being_calculate_speed( local, tmp_speed, loc_state );
    being_genetic_wandering( local, nearest );

    being_territory_index( local );

    being_mass_calculation( group, local, loc_state );
}

function being_tidy_loop_no_sim(local_being, data) {
var _tmp = 0;
var genetics = being_genetics( local_being );
var local_honor = being_honor( local_being );
var delta_e = 0;
var conductance = 5;
var max_honor = data;
    if ( local_honor >= 254 )
    {
        max_honor[0] = 1;
    }
    if ( local_being.delta.awake != FULLY_ASLEEP )
    {
        delta_e = being_move_energy( local_being, conductance );
    }
    else
    {
        being_set_speed( local_being, 0 );

        being_register_movement( local_being, "not fully awake" );

        delta_e += ( 7 ) >> 2;
    }

    if ( delta_e > 0 )
    {
        
        delta_e -= ( ( GENE_HAIR( genetics ) * delta_e ) >> conductance );
        if ( delta_e < 1 )
        {
            delta_e = 1;
        }
    }

    being_energy_delta( local_being, 0 - delta_e );

    if ( land_time() == 0 )
    {
var age_in_years = AGE_IN_YEARS( local_being );
        
        if ( age_in_years > 29 )
        {
            if ( being_random( local_being ) < ( age_in_years - 29 ) )
            {
                being_energy_delta( local_being, 0 - BEING_HUNGRY );
            }
        }
    }
}

function being_recalibrate_honor_loop_no_sim(value) {
var _tmp = 0;
    value.delta.honor = ( ( ( value.delta.honor ) * 220 ) / 255 );
}

function being_remove_internal() {
var _tmp = 0;
    return being_remove_internal_value;
}

function being_remove_external_set(value) {
var _tmp = 0;
    being_remove_external_value = value;
}

function being_remove_loop1(group, local_being, data) {
var _tmp = 0;
    if ( being_energy_less_than( local_being, BEING_DEAD + 1 ) )
    {
        group.ext_death( local_being, group );
    }
}

function being_remove_loop2(group, local, data) {
var _tmp = 0;
var brls = data;

    if ( being_energy_less_than( local, BEING_DEAD + 1 ) == 0 )
    {
        if ( local != brls.being_count )
        {
            memory_copy( local, brls.being_count, sizeof("simulated_being") );
        }
        brls.being_count++;
        brls.count++;
    }
    else
    {
        being_remains( group, local );
        if ( local == brls.reference )
        {
            brls.selected_died = 1;
        }
    }
}

function being_remove_initial(group) {
var _tmp = 0;
var brls = memory_new( sizeof("being_remove_loop2_struct") );

    brls.reference = group.select;
    brls.being_count = group.beings;
    brls.selected_died = 0;
    brls.count = 0;

    if ( being_remove_external_value )
    {
        do {}
        while ( being_remove_external_value );
    }

    being_remove_internal_value = 1;
    return brls;
}

function being_remove_internal_clear() {
var _tmp = 0;
    being_remove_internal_value = 0;
}
