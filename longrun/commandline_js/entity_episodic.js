
/****************************************************************

 episodic.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var local_logging;
var local_social;

function episodic_logging(output_function, social) {
var _tmp = 0;
    local_logging = output_function;
    local_social = social;
}

function episodic_intention_update(local, episode_index) {
var _tmp = 0;
var local_episodic = being_episodic( local );
    var event;
var learned_preference_index = -1;
    if ( local_episodic == 0 )
    {
        return;
    }
    event = local_episodic[episode_index].event - EVENT_INTENTION;
    switch ( event )
    {
    case EVENT_CHAT:
    {
        learned_preference_index = PREFERENCE_CHAT;
        break;
    }
    case EVENT_GROOM:
    {
        if ( ( local_episodic[episode_index].arg & 2 ) != 0 )
        {
            learned_preference_index = PREFERENCE_GROOM_MALE;
        }
        else
        {
            learned_preference_index = PREFERENCE_GROOM_FEMALE;
        }
        break;
    }
    }

    
    if ( learned_preference_index > -1 )
    {
        if ( ( local_episodic[episode_index].arg & 1 ) != 0 )
        {
            if ( local.changes.learned_preference[learned_preference_index] < 255 )
            {
                local.changes.learned_preference[learned_preference_index]++;
            }
        }
        else
        {
            if ( local.changes.learned_preference[learned_preference_index] > 0 )
            {
                local.changes.learned_preference[learned_preference_index]--;
            }
        }
    }
}

function episodic_cycle_no_sim(local_being) {
var _tmp = 0;
    if ( local_being.delta.awake == 0 )
    {
        return;
    }
    {
        var i;
var local_episodic = being_episodic( local_being );
var genetics = being_genetics( local_being );

        if ( !local_episodic )
        {
            return;
        }

        for ( i = 0; i < EPISODIC_SIZE; i++ )
        {
            if ( local_episodic[i].event == 0 )
            {
                continue;
            }

            
            if ( local_episodic[i].event >= EVENT_INTENTION )
            {
                
                if ( being_name_comparison( local_being, local_episodic[i].first_name[BEING_MEETER], local_episodic[i].family_name[BEING_MEETER] ) )
                {
                    if ( spacetime_before_now( local_episodic[i].space_time ) )
                    {
                        local_episodic[i].event = 0;
                        continue;
                    }
                }
                episodic_intention_update( local_being, i );
            }

            
            if ( local_episodic[i].affect < EPISODIC_AFFECT_ZERO )
            {
                
                if ( EPISODIC_AFFECT_ZERO - local_episodic[i].affect > 16 )
                {
                    local_episodic[i].affect += ( 1 + GENE_NEGATIVE_AFFECT_FADE( genetics ) );
                }
                else
                {
                    local_episodic[i].affect++;
                }
            }
            else
            {
                if ( local_episodic[i].affect > EPISODIC_AFFECT_ZERO )
                {
                    
                    if ( local_episodic[i].affect - EPISODIC_AFFECT_ZERO > 16 )
                    {
                        local_episodic[i].affect -= ( 1 + GENE_POSITIVE_AFFECT_FADE( genetics ) );
                    }
                    else
                    {
                        local_episodic[i].affect--;
                    }
                }
            }
        }
    }
}

function episodic_met_being_celebrity(meeter_being, met_being) {
var _tmp = 0;
    var i, j, celebrity = 0, ctr, aff;
var meeter_episodic = being_episodic( meeter_being );
var first_name = being_gender_name( met_being );
var family_name = being_family_name( met_being );

    if ( !meeter_episodic )
    {
        return 0;
    }

    
    for ( i = 0; i < EPISODIC_SIZE; i++ )
    {
        aff = ( meeter_episodic[i].affect ) - EPISODIC_AFFECT_ZERO;
        if ( aff > 1 )
        {
            aff = 1;
        }
        if ( aff < -1 )
        {
            aff = -1;
        }

        
        for ( j = BEING_MEETER; j <= BEING_MET; j++ )
        {
            ctr = 0;
            
            if ( meeter_episodic[i].first_name[j] == first_name )
            {
                celebrity += aff;
                ctr++;
            }
            
            if ( meeter_episodic[i].family_name[j] == family_name )
            {
                celebrity += aff;
                ctr++;
            }
            
            if ( ctr == 2 )
            {
                celebrity += aff * 2;
            }
        }
    }

    
    if ( celebrity > 16 )
    {
        celebrity = 16;
    }
    if ( celebrity < -16 )
    {
        celebrity = -16;
    }
    return celebrity;
}

function episodic_first_person_memories_percent(local, intention) {
var _tmp = 0;
    var i, hits = 0, memories = 0;
var local_episodic = being_episodic( local );
    if ( local_episodic == 0 )
    {
        return 0;
    }

    
    for ( i = 0; i < EPISODIC_SIZE; i++ )
    {
        if ( local_episodic[i].event > 0 )
        {
            if ( intention != 0 )
            {
                
                if ( local_episodic[i].event >= EVENT_INTENTION )
                {
                    hits++;
                }
            }
            else
            {
                
                if ( being_name_comparison( local, local_episodic[i].first_name[BEING_MEETER], local_episodic[i].family_name[BEING_MEETER] ) )
                {
                    hits++;
                }
            }
            memories++;
        }
    }
    if ( memories > 0 )
    {
        return hits * 100 / memories;
    }
    else
    {
        if ( intention != 0 )
        {
            return 0;
        }
        return 100;
    }
}

function simulated_iepisodic_replace_index(event, affect, name1, family1, name2, family2, local) {
var _tmp = 0;
    
var abs_aff = affect;
    var i;
var replace = -1;
    var min;
var event_exists = 0;

var local_episodic = being_episodic( local );

    if ( !local_episodic )
    {
        return -1;
    }

    
    abs_aff = ABS( abs_aff );
    min = abs_aff;
    for ( i = 0; i < EPISODIC_SIZE; i++ )
    {
        
        if ( local_episodic[i].event == event )
        {
            
            if ( ( local_episodic[i].first_name[BEING_MEETER] == name1 ) &&
                    ( local_episodic[i].family_name[BEING_MEETER] == family1 ) )
            {
                
var aff1 = ABS( ( local_episodic[i].affect ) - EPISODIC_AFFECT_ZERO );
                
                event_exists = 1;
                if ( aff1 <= min )
                {
                    min = aff1;
                    replace = i;
                }
            }
        }
    }

    if ( event_exists == 0 )
    {
        
        for ( i = 0; i < EPISODIC_SIZE; i++ )
        {
            if ( local_episodic[i].event == 0 )
            {
                return i;
            }
        }

        
        min = abs_aff;
        for ( i = 0; i < EPISODIC_SIZE; i++ )
        {
            
var aff1 = ABS( ( local_episodic[i].affect ) - EPISODIC_AFFECT_ZERO );
            
            if ( aff1 < min )
            {
                min = aff1;
                replace = i;
            }
        }
    }

    return replace;
}

function episodic_store_full(local, event, affect, name1, family1, name2, family2, arg, food) {
var _tmp = 0;
var local_episodic = being_episodic( local );
    var replace;
    var old_event;
    var old_time;
    var new_time;

    if ( local_episodic == 0 )
    {
        return;
    }

    if ( local.delta.awake == FULLY_ASLEEP )
    {
        return;
    }

    replace = simulated_iepisodic_replace_index( event, affect, name1, family1, name2, family2, local );

    if ( replace == -1 )
    {
        return;
    }

    old_event = local_episodic[replace].event;
    old_time = local_episodic[replace].space_time.time;

    
    local_episodic[replace].event       = event;
    local_episodic[replace].affect      = ( affect + EPISODIC_AFFECT_ZERO );

    spacetime_set( local_episodic[replace].space_time, being_location( local ) );

    new_time = local_episodic[replace].space_time.time;

    local_episodic[replace].first_name[BEING_MEETER] = name1;
    local_episodic[replace].family_name[BEING_MEETER] = family1;
    local_episodic[replace].first_name[BEING_MET] = name2;
    local_episodic[replace].family_name[BEING_MET] = family2;
    local_episodic[replace].food = food;
    local_episodic[replace].arg = arg;

    if ( ( event == 0 ) || ( event >= EVENTS ) )
    {
        SHOW_ERROR( "Event outside scope" );
    }

    if ( local_logging )
    {
        if ( ( old_event != event )  ) 
        {
var description = new Array( STRING_BLOCK_SIZE );
var str = new Array( STRING_BLOCK_SIZE );
var time = new Array( STRING_BLOCK_SIZE );
var combination = new Array( STRING_BLOCK_SIZE );
            var social_event;

            social_event = episode_description( local, replace, description );

            if ( ( local_social == 1 ) && ( social_event == 0 ) )
            {
                return;
            }

            str = being_name_simple( local, str );
            time = spacetime_to_string( time );
            io_three_string_combination( combination, time, str, description, 35 );

            local_logging( combination );
        }
    }
}

function episodic_food(local, energy, food_type) {
var _tmp = 0;
    episodic_store_full( local, EVENT_EAT, energy,
                         being_gender_name( local ), being_family_name( local ),
                         0, 0, 0, food_type );
}

function episodic_store_memory(local, event, affect, name1, family1, name2, family2, arg) {
var _tmp = 0;
    episodic_store_full( local, event, affect, name1, family1, name2, family2, arg, 0 );
}

function episodic_self(local, event, affect, arg) {
var _tmp = 0;
    episodic_store_memory( local, event, affect,
                           being_gender_name( local ), being_family_name( local ),
                           0, 0, arg );
}

function episodic_close(local, other, event, affect, arg) {
var _tmp = 0;
    episodic_store_memory(
        local, event, affect,
        being_gender_name( other ), being_family_name( other ),
        0, 0, arg );
}

function episodic_interaction(local, other, event, affect, arg) {
var _tmp = 0;
    episodic_store_memory(
        local, event, affect,
        being_gender_name( local ), being_family_name( local ),
        being_gender_name( other ), being_family_name( other ), arg );
}

function episodic_intention(local, episode_index, mins_ahead, args) {
var _tmp = 0;
    var date;
    var time;
    var replace;
    var event;

var local_episodic = being_episodic( local );

    if ( local_episodic == 0 )
    {
        return 0;
    }

    event = local_episodic[episode_index].event;

    if ( event == 0 )
    {
        return 0;
    }

    time = land_time();
    date = local_episodic[episode_index].space_time.date;
    if ( time >= TIME_DAY_MINUTES )
    {
        
        time %= TIME_DAY_MINUTES;
        date++;
    }

    if ( event >= EVENT_INTENTION )
    {
        
        local_episodic[episode_index].space_time.time = time;
        local_episodic[episode_index].space_time.date = date;
        local_episodic[episode_index].arg = args;
        
        local_episodic[episode_index].first_name[BEING_MEETER] = being_gender_name( local );
        local_episodic[episode_index].family_name[BEING_MEETER] = being_family_name( local );
        return 1;
    }

    
    if ( !( ( event == EVENT_GROOM ) || ( event == EVENT_CHAT ) ) )
    {
        return 0;
    }

    
    replace = simulated_iepisodic_replace_index(
                  EVENT_INTENTION + event,
                  ( local_episodic[episode_index].affect ) - EPISODIC_AFFECT_ZERO,
                  being_gender_name( local ),
                  being_family_name( local ),
                  local_episodic[episode_index].first_name[BEING_MET],
                  local_episodic[episode_index].family_name[BEING_MET],
                  local );

    if ( replace == -1 )
    {
        return 0;
    }

    if ( replace == episode_index )
    {
        return 0;
    }

    memory_copy( local_episodic[episode_index], local_episodic[replace], sizeof("simulated_iepisodic") );

    local_episodic[replace].event = EVENT_INTENTION + event;

    local_episodic[replace].space_time.time = time;
    local_episodic[replace].space_time.date = date;

    local_episodic[replace].first_name[BEING_MEETER] = being_gender_name( local );
    local_episodic[replace].family_name[BEING_MEETER] = being_family_name( local );

    local_episodic[replace].arg = args;

    return 1;
}

function episodic_anecdote(local, other) {
var _tmp = 0;
var local_episodic = being_episodic( local );
var other_episodic = being_episodic( other );
    var affect;
    var event;
    var replace, mult = 1;

    if ( local_episodic == 0 || other_episodic == 0 || local == other )
    {
        return 0;
    }

    affect = ( local_episodic[being_attention( local, ATTENTION_EPISODE )].affect ) - EPISODIC_AFFECT_ZERO;
    event = local_episodic[being_attention( local, ATTENTION_EPISODE )].event;

    
    if ( ( event == 0 ) ||
            ( local.delta.awake == FULLY_ASLEEP ) ||
            ( other.delta.awake == FULLY_ASLEEP ) )
    {
        return 0;
    }

    if ( local.delta.awake != FULLY_AWAKE )
    {
        
        mult = 2;
    }

    
    if ( being_random( local ) <
            ( ANECDOTE_EVENT_MUTATION_RATE +
              ( local.changes.learned_preference[PREFERENCE_ANECDOTE_EVENT_MUTATION] ) * 100 )*mult )
    {
        event = ( being_random( local ) % EVENTS );
    }
    if ( being_random( local ) <
            ( ANECDOTE_AFFECT_MUTATION_RATE +
              ( local.changes.learned_preference[PREFERENCE_ANECDOTE_AFFECT_MUTATION] ) * 100 )*mult )
    {
        
        affect = ( affect * ( 64 + ( being_random( local ) & 127 ) ) ) / 128;
        
        if ( affect < -32000 )
        {
            affect = -32000;
        }
        if ( affect > 32000 )
        {
            affect = 32000;
        }
    }

    
    replace = simulated_iepisodic_replace_index(
                  event, affect,
                  local_episodic[being_attention( local, ATTENTION_EPISODE )].first_name[BEING_MEETER],
                  local_episodic[being_attention( local, ATTENTION_EPISODE )].family_name[BEING_MEETER],
                  local_episodic[being_attention( local, ATTENTION_EPISODE )].first_name[BEING_MET],
                  local_episodic[being_attention( local, ATTENTION_EPISODE )].family_name[BEING_MET],
                  local );

    if ( replace == -1 )
    {
        return 0;
    }

    other_episodic[replace] = local_episodic[being_attention( local, ATTENTION_EPISODE )];
    other_episodic[replace].event = event;
    other_episodic[replace].affect = ( affect + EPISODIC_AFFECT_ZERO );

    
    being_set_attention( local, ATTENTION_EPISODE, replace );

    return 1;
}

function episodic_interaction(local, other, event, affect, arg) {
var _tmp = 0;

}

function episodic_store_memory(local, event, affect, name1, family1, name2, family2, arg) {
var _tmp = 0;
}
