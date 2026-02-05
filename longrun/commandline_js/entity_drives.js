
/****************************************************************

 drives.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var GENE_MATE_SEEK = (...args) => (null);

function drives_hunger(local) {
var _tmp = 0;
    
    if ( being_energy_less_than( local, BEING_HUNGRY ) )
    {
        
        being_inc_drive( local, DRIVE_HUNGER );
        
        being_dec_drive( local, DRIVE_SEX );
    }
    else
    {
        
        being_dec_drive( local, DRIVE_HUNGER );
    }
}

function drives_sociability_loop_no_sim(other, data) {
var _tmp = 0;
var dsd = data;
    var distance_squared;
    var difference_vector = vect2_new();
    
var apespace_span = 2; 
    being_delta( dsd.being, other, difference_vector );
    
    distance_squared = vect2_dot( difference_vector, difference_vector, 1, 1 );
    if ( distance_squared < ( apespace_span * apespace_span ) )
    {
        dsd.beings_in_vacinity++;
    }
}

function drives_sociability(local, group) {
var _tmp = 0;
    var dsd = {};
    dsd.beings_in_vacinity = 0;
    dsd.being = local;
    loop_being_no_sim( group.beings, group.num, drives_sociability_loop_no_sim, dsd );

    being_crowding_cycle( local, dsd.beings_in_vacinity );
}

function drives_sex(local, awake) {
var _tmp = 0;
    var i, max;
var local_social_graph = being_social( local );
var age_in_days = AGE_IN_DAYS( local );


var local_episodic = being_episodic( local );


    
    if ( age_in_days > AGE_OF_MATURITY )
    {
        
        if ( awake )
        {
            
            being_inc_drive( local, DRIVE_SEX );

            
            if ( ( being_drive( local, DRIVE_SEX ) > THRESHOLD_SEEK_MATE ) &&
                    being_check_goal( local, GOAL_NONE ) )
            {
                
                if ( GENE_MATE_SEEK( being_genetics( local ) ) & 1 )
                {
                    

                    if ( !local_episodic )
                    {
                        return;
                    }

                    
                    for ( i = 0; i < EPISODIC_SIZE; i++ )
                    {
                        if ( local_episodic[i].event == EVENT_MATE )
                        {
                            

                            if ( being_name_comparison( local, local_episodic[i].first_name[BEING_MEETER], local_episodic[i].family_name[BEING_MEETER] ) )
                            {
                                

                                being_set_goal_mate( local, local_episodic[i].first_name[BEING_MET], local_episodic[i].family_name[BEING_MET] );

                                
                                episodic_store_memory(
                                    local, EVENT_SEEK_MATE, AFFECT_SEEK_MATE,
                                    being_gender_name( local ), being_family_name( local ),
                                    local.delta.goal[1], local.delta.goal[2], 0 );
                                break;
                            }
                        }
                    }

                    
                    if ( being_check_goal( local, GOAL_MATE ) == 0 )
                    {
                        max = 0;
                        if ( !local_social_graph )
                        {
                            return;
                        }

                        for ( i = 1; i < SOCIAL_SIZE_BEINGS; i++ )
                        {
                            if ( !SOCIAL_GRAPH_ENTRY_EMPTY( local_social_graph, i ) )
                            {
                                if ( ( local_social_graph[i].attraction ) > max )
                                {

                                    
                                    max = local_social_graph[i].attraction;

                                    being_set_goal_mate( local, local_social_graph[i].first_name[BEING_MET], local_social_graph[i].family_name[BEING_MET] );
                                }
                            }
                        }
                        
                        if ( being_check_goal( local, GOAL_MATE ) )
                        {
                            episodic_store_memory(
                                local, EVENT_SEEK_MATE, AFFECT_SEEK_MATE,
                                being_gender_name( local ), being_family_name( local ),
                                local.delta.goal[1], local.delta.goal[2], 0 );
                        }
                    }
                }
            }
            
            if ( being_pregnant( local ) != 0 )
            {
                if ( being_drive( local, DRIVE_SEX ) >= GESTATION_SEX_DRIVE_DECREMENT )
                {
                    being_dec_drive( local, DRIVE_SEX );
                }
            }
        }
        else
        {
            
            being_dec_drive( local, DRIVE_SEX );
        }
        
        if ( ( being_drive( local, DRIVE_SEX ) < THRESHOLD_SEEK_MATE ) &&
                being_check_goal( local, GOAL_MATE ) )
        {
            being_set_goal_none( local );
        }
    }
}

function drives_fatigue(local) {
var _tmp = 0;
    
    if ( being_speed( local ) > FATIGUE_SPEED_THRESHOLD )
    {
        being_inc_drive( local, DRIVE_FATIGUE );
        
        if ( being_state( local ) & BEING_STATE_SWIMMING )
        {
            being_inc_drive( local, DRIVE_FATIGUE );
        }
        
        being_dec_drive( local, DRIVE_SEX );
    }
    else
    {
        
        being_dec_drive( local, DRIVE_FATIGUE );
    }
}

function drives_cycle(group, local_being, data) {
var _tmp = 0;
    drives_hunger( local_being );
    drives_sociability( local_being, group );
    drives_sex( local_being, local_being.delta.awake );
    drives_fatigue( local_being );
}
