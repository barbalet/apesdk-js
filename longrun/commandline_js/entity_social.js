
/****************************************************************

 social.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var GENE_STATUS_PREFERENCE = (...args) => (null);
var GENE_PIGMENTATION_PREFERENCE = (...args) => (null);
var GENE_HEIGHT_PREFERENCE = (...args) => (null);
var GENE_FRAME_PREFERENCE = (...args) => (null);
var GENE_HAIR_PREFERENCE = (...args) => (null);
var GENE_GROOM = (...args) => (null);
var GENE_AGGRESSION = (...args) => (null);
var GENE_MATE_BOND = (...args) => (null);
var GENE_INCEST_AVERSION = (...args) => (null);
var GENE_LATENT_ENERGY_USE = (...args) => (null);

function simulated_feature_copy(to, from) {
var _tmp = 0;
    to.type = from.type;
    to.value = from.value;
    to.frequency = from.frequency;
}

function simulated_feature_set(to, feature_type, feature_value) {
var _tmp = 0;
    to.type =  feature_type;
    to.value =  feature_value;
    to.frequency = 1;
}

function simulated_featureset_feature_index(s, feature_type) {
var _tmp = 0;
var i = 0;

    while ( i < s.feature_number )
    {
        if ( s.features[i].type >= feature_type )
        {
            break;
        }
        i++;
    }
    if ( i == s.feature_number )
    {
        return -1;
    }
    return i;
}

function simulated_featureset_normalise_feature_frequencies(s) {
var _tmp = 0;
    var i, tot = 0;
var max = MAX_FEATURE_FREQUENCY >> 1;

    
    for ( i = 0; i < s.feature_number; i++ )
    {
        tot += s.features[i].frequency;
    }

    if ( tot == 0 )
    {
        tot = 1;
    }

    for ( i = 0; i < s.feature_number; i++ )
    {
        s.features[i].frequency = ( s.features[i].frequency * max / tot );
    }
}

function simulated_featureset_update(s, feature_type, feature_value) {
var _tmp = 0;
    
var feature_index = simulated_featureset_feature_index( s, feature_type );
    var min;
    var i, j;

    if ( s.features[feature_index].type == feature_type )
    {
        
        s.features[feature_index].value = feature_value;
        s.features[feature_index].frequency++;
        
        if ( s.features[feature_index].frequency > MAX_FEATURE_FREQUENCY )
        {
            simulated_featureset_normalise_feature_frequencies( s );
        }
        return 0;
    }
    else
    {
        if ( s.feature_number < MAX_FEATURESET_SIZE )
        {
            
            if ( s.feature_number > 1 )
            {
                for ( i = s.feature_number - 1; i >= feature_index; i-- )
                {
                    simulated_feature_copy( ( s.features[i + 1] ), ( s.features[i] ) );
                }
            }

            i = feature_index;
            s.feature_number++;
            simulated_feature_set( ( s.features[i] ), feature_type, feature_value );
            return 0;
        }
        else
        {
            
            min = s.features[0].frequency;
            feature_index = 0;
            for ( i = 1; i < s.feature_number; i++ )
            {
                if ( s.features[i].frequency < min )
                {
                    min = s.features[i].frequency;
                    feature_index = i;
                }
            }
            
            j = 0;
            for ( i = 0; i < s.feature_number; i++ )
            {
                if ( s.features[i].type >= feature_type )
                {
                    j = i;
                    break;
                }
            }
            for ( i = feature_index; i > j; i-- )
            {
                simulated_feature_copy( ( s.features[i] ), ( s.features[i - 1] ) );
            }


            simulated_feature_set( ( s.features[j] ), feature_type, feature_value );

            for ( i = 0; i < s.feature_number; i++ )
            {
                for ( j = i + 1; j < s.feature_number; j++ )
                {
                    if ( s.features[j].type < s.features[i].type )
                    {
                        feature_type = s.features[i].type;
                        s.features[i].type = s.features[j].type;
                        s.features[j].type = feature_type;
                    }
                }
            }
        }
    }
    return -1;
}

function featureset_match_threshold(feature_type) {
var _tmp = 0;
    if ( feature_type == FEATURESET_TERRITORY )
    {
        return 1;
    }
    return 2;
}

function social_normalise_stereotype_observations(local_being) {
var _tmp = 0;
    var graph;
    var i, tot = 0;
    var s = {};
var max = MAX_FEATURESET_OBSERVATIONS >> 1;

    
    graph = being_social( local_being );

    if ( graph == 0 )
    {
        return;
    }

    for ( i = SOCIAL_SIZE_BEINGS; i < SOCIAL_SIZE; i++ )
    {
        if ( !SOCIAL_GRAPH_ENTRY_EMPTY( graph, i ) )
        {
            s = graph[i].classification;
            tot += s.observations;
        }
    }

    if ( tot == 0 )
    {
        return;
    }

    for ( i = SOCIAL_SIZE_BEINGS; i < SOCIAL_SIZE; i++ )
    {
        if ( !SOCIAL_GRAPH_ENTRY_EMPTY( graph, i ) )
        {
            s = graph[i].classification;
            s.observations =
                ( s.observations * max / tot );
        }
    }
}

function social_get_stereotype(meeter_being, social_graph_index) {
var _tmp = 0;
    var i, j, diff, dv, index, hits, min = 0, result = -1;
    var normalise_features;
    var meeter_social_graph;
    var s1,  s2;

    
    meeter_social_graph = being_social( meeter_being );

    if ( meeter_social_graph == 0 )
    {
        return -1;
    }

    
    s2 = meeter_social_graph[social_graph_index].classification;

    
    for ( i = SOCIAL_SIZE_BEINGS; i < SOCIAL_SIZE; i++ )
    {
        if ( !SOCIAL_GRAPH_ENTRY_EMPTY( meeter_social_graph, i ) )
        {
            
            s1 = meeter_social_graph[i].classification;
            normalise_features = 0;
            diff = 0;
            hits = 0;
            
            for ( j = 0; j < s1.feature_number; j++ )
            {
                
                index = simulated_featureset_feature_index( s2, s1.features[j].type );
                if ( index > -1 )
                {
                    hits++;
                    
                    dv = s1.features[j].value -
                         s2.features[index].value;
                    if ( dv < 0 )
                    {
                        dv = -dv;
                    }

                    
                    diff += dv;

                    
                    if ( dv < featureset_match_threshold( s1.features[j].type ) )
                    {
                        
                        s1.features[j].frequency++;
                        if ( s1.features[j].frequency > MAX_FEATURE_FREQUENCY )
                        {
                            normalise_features = 1;
                        }
                    }
                }
            }
            
            if ( hits == s1.feature_number )
            {
                if ( ( result == -1 ) || ( diff < min ) )
                {
                    min = diff;
                    result  = i;
                }
                
                s1.observations++;
                if ( s1.observations > MAX_FEATURESET_OBSERVATIONS )
                {
                    social_normalise_stereotype_observations( meeter_being );
                }
            }

            
            if ( normalise_features == 1 )
            {
                simulated_featureset_normalise_feature_frequencies( s1 );
            }
        }
    }
    return result;
}

function social_meet_update_features(meeter_being, met_being, social_graph_index) {
var _tmp = 0;
    var meeter_social_graph;

    var idx;


    
    meeter_social_graph = being_social( meeter_being );

    if ( meeter_social_graph == 0 )
    {
        return;
    }

    

    simulated_featureset_update( meeter_social_graph[social_graph_index].classification,
                                 FEATURESET_PIGMENTATION,
                                 GENE_PIGMENTATION( being_genetics( met_being ) ) );

    simulated_featureset_update( meeter_social_graph[social_graph_index].classification,
                                 FEATURESET_HAIR,
                                 GENE_HAIR( being_genetics( met_being ) ) );

    simulated_featureset_update( meeter_social_graph[social_graph_index].classification,
                                 FEATURESET_HEIGHT,
                                 being_height( met_being ) );

    simulated_featureset_update( meeter_social_graph[social_graph_index].classification,
                                 FEATURESET_FAT,
                                 GET_BODY_FAT( met_being ) );

    simulated_featureset_update( meeter_social_graph[social_graph_index].classification,
                                 FEATURESET_EYE_SHAPE,
                                 GENE_EYE_SHAPE( being_genetics( met_being ) ) );

    simulated_featureset_update( meeter_social_graph[social_graph_index].classification,
                                 FEATURESET_EYE_COLOR,
                                 GENE_EYE_COLOR( being_genetics( met_being ) ) );

    simulated_featureset_update( meeter_social_graph[social_graph_index].classification,
                                 FEATURESET_EYE_SEPARATION,
                                 GENE_EYE_SEPARATION( being_genetics( met_being ) ) );

    simulated_featureset_update( meeter_social_graph[social_graph_index].classification,
                                 FEATURESET_NOSE_SHAPE,
                                 GENE_NOSE_SHAPE( being_genetics( met_being ) ) );

    simulated_featureset_update( meeter_social_graph[social_graph_index].classification,
                                 FEATURESET_EAR_SHAPE,
                                 GENE_EAR_SHAPE( being_genetics( met_being ) ) );

    simulated_featureset_update( meeter_social_graph[social_graph_index].classification,
                                 FEATURESET_EYEBROW_SHAPE,
                                 GENE_EYEBROW_SHAPE( being_genetics( met_being ) ) );

    simulated_featureset_update( meeter_social_graph[social_graph_index].classification,
                                 FEATURESET_MOUTH_SHAPE,
                                 GENE_MOUTH_SHAPE( being_genetics( met_being ) ) );


    idx = APESPACE_TO_TERRITORY( being_location_y( meeter_being ) ) * TERRITORY_DIMENSION +
          APESPACE_TO_TERRITORY( being_location_x( meeter_being ) );

    simulated_featureset_update( meeter_social_graph[social_graph_index].classification,
                                 FEATURESET_TERRITORY,
                                 meeter_being.events.territory[idx].name );

}

function social_graph_link_name(group, local_being, social_graph_index, met, name) {
var _tmp = 0;
    var local_social_graph;

    
    local_social_graph = being_social( local_being );

    if ( local_social_graph == 0 )
    {
        return;
    }

    switch ( local_social_graph[social_graph_index].entity_type )
    {
    case ENTITY_BEING:
    {
        being_name_byte2( local_social_graph[social_graph_index].first_name[met], local_social_graph[social_graph_index].family_name[met], name );
        break;
    }
    case ENTITY_BEING_GROUP:
        SHOW_ERROR( "Unimplemented being group entity type" );
        break;
    case ENTITY_OBJECT:
        SHOW_ERROR( "Unimplemented object entity type" );
        break;
    case ENTITY_TERRITORY:
        SHOW_ERROR( "Unimplemented territory entity type" );
        break;
    default:
        SHOW_ERROR( "Unimplemented entity type" );
        break;
    }
}

function social_group_align_preferences(group, meeter_being, met_being, social_graph_index) {
var _tmp = 0;
    var i, incr = -1;
    var social_graph;

    
    if ( ( meeter_being == met_being ) || ( social_graph_index < 1 ) )
    {
        return;
    }

    
    social_graph = being_social( meeter_being );

    if ( social_graph == 0 )
    {
        return;
    }

    
    if ( SOCIAL_GRAPH_ENTRY_EMPTY( social_graph, social_graph_index ) )
    {
        return;
    }

    
    if ( social_graph[social_graph_index].friend_foe >=
            social_respect_mean( meeter_being ) )
    {
        incr = 1;
    }

    
    for ( i = 0; i < PREFERENCES; i++ )
    {
var resultant = meeter_being.changes.learned_preference[i];
        if ( resultant < met_being.changes.learned_preference[i] )
        {
            if ( ( incr > 0 ) || ( ( incr < 0 ) && ( resultant > 0 ) ) )
            {
                resultant += incr;
            }
        }
        else if ( resultant > met_being.changes.learned_preference[i] )
        {
            if ( ( incr > 0 ) || ( ( incr < 0 ) && ( meeter_being.changes.learned_preference[i] < 255 ) ) )
            {
                resultant -= incr;
            }
        }
        meeter_being.changes.learned_preference[i] = resultant;
    }
}

function social_attraction_pigmentation(being_meeter, being_met) {
var _tmp = 0;
    var ppref, pdiff;
var fem = ( FIND_SEX( GET_I( being_meeter ) ) == SEX_FEMALE );

    
    ppref = NATURE_NURTURE(
                GENE_PIGMENTATION_PREFERENCE( being_genetics( being_meeter ) ),
                being_meeter.changes.learned_preference[PREFERENCE_MATE_PIGMENTATION_MALE + fem] );

    pdiff = GENE_PIGMENTATION( being_genetics( being_met ) ) - ppref;

    if ( ( pdiff >= -2 ) && ( pdiff <= 2 ) )
    {
        pdiff = ABS( pdiff );
        return ( 3 - pdiff );
    }
    return 0;
}

function social_attraction_hair(meeter_being, met_being) {
var _tmp = 0;
    var ppref, pdiff;
var fem = ( FIND_SEX( GET_I( meeter_being ) ) == SEX_FEMALE );

    

    ppref = NATURE_NURTURE(
                GENE_HAIR_PREFERENCE( being_genetics( meeter_being ) ),
                meeter_being.changes.learned_preference[PREFERENCE_MATE_HAIR_MALE + fem] );
    pdiff = GENE_HAIR( being_genetics( met_being ) ) - ppref;

    if ( ( pdiff >= -2 ) && ( pdiff <= 2 ) )
    {
        pdiff = ABS( pdiff );
        return ( 3 - pdiff );
    }
    return 0;
}

function social_attraction_height(meeter_being, met_being) {
var _tmp = 0;
    var ppref;
var fem = ( FIND_SEX( GET_I( meeter_being ) ) == SEX_FEMALE );

    

    ppref = NATURE_NURTURE(
                GENE_HEIGHT_PREFERENCE( being_genetics( meeter_being ) ),
                meeter_being.changes.learned_preference[PREFERENCE_MATE_HEIGHT_MALE + fem] );

    
    if ( ppref >= 8 )
    {
        if ( ( ppref >= 12 ) && ( being_height( met_being ) > being_height( meeter_being ) ) )
        {
            
            return 1;
        }
        else
        {
            if ( ( ppref < 12 ) && ( being_height( met_being ) < being_height( meeter_being ) ) )
            {
                
                return 1;
            }
        }
    }
    return 0;
}

function social_attraction_frame(meeter_being, met_being) {
var _tmp = 0;
    var ppref;
var fem = ( FIND_SEX( GET_I( meeter_being ) ) == SEX_FEMALE );

    

    ppref = NATURE_NURTURE(
                GENE_FRAME_PREFERENCE( being_genetics( meeter_being ) ),
                meeter_being.changes.learned_preference[PREFERENCE_MATE_FRAME_MALE + fem] );

    if ( ( ppref > 6 ) && ( ppref <= 11 ) && ( GET_BODY_FAT( met_being ) > GET_BODY_FAT( meeter_being ) ) )
    {
        
        return 1;
    }
    else
    {
        if ( ( ppref > 11 ) && ( GET_BODY_FAT( met_being ) < GET_BODY_FAT( meeter_being ) ) )
        {
            
            return 1;
        }
    }
    return 0;
}

function social_attraction_pheromone(meeter_being, met_being) {
var _tmp = 0;
    var ch, i, different = 0;
var meeter_genetics = being_genetics( meeter_being );
var met_genetics = being_genetics( met_being );

    for ( ch = 0; ch < CHROMOSOMES; ch++ )
    {
        for ( i = 0; i < 32; i++ )
        {
            if ( ( ( meeter_genetics[ch] >> i ) & 1 ) != ( ( met_genetics[ch] >> i ) & 1 ) )
            {
                different++;
            }
        }
    }
    if ( different < MINIMUM_GENETIC_VARIATION )
    {
        return 0 - GENE_INCEST_AVERSION( meeter_genetics );
    }
    else
    {
        return 1;
    }
}

function get_simulated_isocial(meeter_being, met_being) {
var _tmp = 0;
    var i;
var graph = being_social( meeter_being );

    if ( !graph )
    {
        return -1;
    }

    for ( i = 1; i < SOCIAL_SIZE_BEINGS; i++ )
    {
        if ( !SOCIAL_GRAPH_ENTRY_EMPTY( graph, i ) )
        {
            if ( graph[i].entity_type == ENTITY_BEING )
            {
                if ( being_name_comparison( met_being, graph[i].first_name[BEING_MET], graph[i].family_name[BEING_MET] ) )
                {
                    return i;
                }
            }
        }
    }
    return -1;
}

function get_stranger_link(meeter_being, met_being) {
var _tmp = 0;
var i = 1;
var stranger_index = -1;
var stranger = 65535, familiarity = 0;
    var time_since_met;
var graph = being_social( meeter_being );
    if ( !graph )
    {
        return 0;
    }

    for ( i = 1; i < SOCIAL_SIZE_BEINGS; i++ )
    {
        if ( !SOCIAL_GRAPH_ENTRY_EMPTY( graph, i ) )
        {
            
            if ( !IS_FAMILY_MEMBER( graph, i ) )
            {
                
                familiarity = graph[i].familiarity;
                if ( familiarity < stranger )
                {
                    
                    time_since_met = land_date() - graph[i].space_time.date;

                    if ( ( time_since_met >= SOCIAL_FORGET_DAYS ) ||
                            ( graph[i].space_time.date == 0 ) )
                    {
                        stranger = familiarity;
                        stranger_index = i;
                    }
                }
            }
        }
        else
        {
            
            stranger_index = i;
            break;
        }
    }
    return stranger_index;
}

function social_meet(meeter_being, met_being, location_type) {
var _tmp = 0;
    var friend_or_foe, index = -1, stereotype_index = -1;

var familiarity = 0;
var graph = being_social( meeter_being );
var met = 0;

    if ( !graph )
    {
        return -1;
    }

    
    immune_transmit( meeter_being.immune_system, met_being.immune_system, PATHOGEN_TRANSMISSION_AIR );

    
    index = get_simulated_isocial( meeter_being, met_being );
    if ( index > 0 )
    {
        familiarity = graph[index].familiarity;
        met = 1;
    }
    else
    {
        
        index = get_stranger_link( meeter_being, met_being );
    }

    if ( ( met == 1 ) || ( ( met == 0 ) && ( index > 0 ) ) )
    {

        
        social_meet_update_features(
            meeter_being, met_being, index );

        
        stereotype_index = social_get_stereotype(
                               meeter_being, index );

        
        being_set_attention( meeter_being, ATTENTION_ACTOR, index );

        
        if ( met == 0 )
        {
            if ( stereotype_index > -1 )
            {
                
                friend_or_foe =
                    graph[stereotype_index].friend_foe;
            }
            else
            {
                
                friend_or_foe =
                    SOCIAL_RESPECT_NORMAL -
                    social_attraction_pheromone( meeter_being, met_being ) +
                    social_attraction_pigmentation( meeter_being, met_being ) +
                    social_attraction_height( meeter_being, met_being ) +
                    social_attraction_frame( meeter_being, met_being ) +
                    social_attraction_hair( meeter_being, met_being )

                    + episodic_met_being_celebrity( meeter_being, met_being )

                    ;

                

            }
            
            graph[index].entity_type = ENTITY_BEING;

            
            graph[index].first_name[BEING_MEETER] = being_gender_name( meeter_being );
            graph[index].family_name[BEING_MEETER] = being_family_name( meeter_being );
            
            graph[index].first_name[BEING_MET] = being_gender_name( met_being );
            graph[index].family_name[BEING_MET] = being_family_name( met_being );

            
            graph[index].attraction = 0;

            
            if ( friend_or_foe < 0 )
            {
                friend_or_foe = 0;
            }
            if ( friend_or_foe > 255 )
            {
                friend_or_foe = 255;
            }
            graph[index].friend_foe = friend_or_foe;

            
            being_init_braincode( meeter_being, met_being, graph[index].friend_foe, BRAINCODE_EXTERNAL );

        }

        if ( location_type == LOCATION_KNOWN )
        {
            
            graph[index].space_time.location[0] = being_location_x( meeter_being );
            graph[index].space_time.location[1] = being_location_y( meeter_being );
        }
        else
        {
            
            graph[index].space_time.location[0] = 0;
            graph[index].space_time.location[1] = 0;
        }

        
        graph[index].belief = being_state( met_being );

        
        graph[index].space_time.date = land_date();
        graph[index].space_time.time = land_time();

        
        if ( familiarity < 65535 )
        {
            graph[index].familiarity = familiarity + 1;
        }

        
        if ( graph[index].friend_foe < 255 )
        {
            graph[index].friend_foe++;
        }
    }
    return index;
}

function social_get_relationship(meeter_being, relationship) {
var _tmp = 0;
    var index;
    var meeter_social_graph;

    
    meeter_social_graph = being_social( meeter_being );

    if ( meeter_social_graph == 0 )
    {
        return -1;
    }

    
    for ( index = 1; index < SOCIAL_SIZE_BEINGS; index++ )
    {
        
        if ( meeter_social_graph[index].relationship == relationship )
        {
            return index;
        }
    }
    return -1;
}

function social_set_relationship(group, meeter_being, relationship, met_being) {
var _tmp = 0;
    var index;
    var meeter_social_graph;

    
    if ( relationship == 0 )
    {
        return -1;
    }

    
    index = social_meet( meeter_being, met_being, LOCATION_UNKNOWN );
    if ( index > -1 )
    {
        
        meeter_social_graph = being_social( meeter_being );

        if ( meeter_social_graph == 0 )
        {
            return -1;
        }

        
        meeter_social_graph[index].relationship = relationship;
    }
    return index;
}

function social_network(group, meeter_being, met_being, distance) {
var _tmp = 0;
var being_index = -1;
    if ( distance < SOCIAL_RANGE )
    {
        being_index = social_meet( meeter_being, met_being, LOCATION_KNOWN );
    }
    return being_index;
}

function social_parasite_cycle(meeter_being, met_being, distance) {
var _tmp = 0;
    

var paraprob = being_random( meeter_being );
    if ( paraprob < ( PARASITE_ENVIRONMENT + ( PARASITE_BREED * being_parasites( meeter_being ) ) ) )
    {
        being_add_parasites( meeter_being );
    }

    
    being_energy_delta( meeter_being, 0 - ( PARASITE_ENERGY_COST * being_parasites( meeter_being ) ) );

    if ( distance < PARASITE_HOP_MAX_DISTANCE )
    {
        
        if ( being_parasites( met_being ) < being_parasites( meeter_being ) )
        {
            being_add_parasites( met_being );
            being_remove_parasites( meeter_being, 1 );
        }
    }

}

function social_groom(group, meeter_being, met_being, distance, awake, familiarity) {
var _tmp = 0;
    var meeter_index, met_index;
var grooming = 0, groom_decisions, groomloc;
    var gpref;

    social_parasite_cycle( meeter_being, met_being, distance );

    
    if ( ( awake != FULLY_ASLEEP ) &&
            ( distance < GROOMING_MAX_SEPARATION ) &&
            ( being_speed( meeter_being ) < MAX_SPEED_WHILST_GROOMING ) )
    {
var groomprob = being_random( meeter_being ) & 16383;
        if ( familiarity > 16 )
        {
            familiarity = 16;
        }

        {
            
var fem = ( FIND_SEX( GET_I( met_being ) ) == SEX_FEMALE );

            
            gpref = NATURE_NURTURE(
                        GENE_GROOM( being_genetics( meeter_being ) ),
                        meeter_being.changes.learned_preference[PREFERENCE_GROOM_MALE + fem] );
        }
        
        if ( groomprob <
                GROOMING_PROB + ( gpref * ( 1 + familiarity )*GROOMING_PROB_HONOR * ( 1 + being_honor( met_being ) ) ) )
        {
            
            immune_transmit( meeter_being.immune_system, met_being.immune_system, PATHOGEN_TRANSMISSION_TOUCH );
            immune_transmit( met_being.immune_system, meeter_being.immune_system, PATHOGEN_TRANSMISSION_TOUCH );

            
            groomloc = being_attention( meeter_being, ATTENTION_BODY );
            groom_decisions = 0;
            while ( ( met_being.changes.inventory[groomloc] & INVENTORY_GROOMED ) && ( groom_decisions < 4 ) )
            {
                met_being.changes.inventory[groomloc] |= INVENTORY_GROOMED;
                groomloc = ( being_random( meeter_being ) % INVENTORY_SIZE );
                groom_decisions++;
            }
            
            if ( met_being.changes.inventory[groomloc] & INVENTORY_WOUND )
            {
                met_being.changes.inventory[groomloc] = INVENTORY_GROOMED;
            }
            
            being_set_attention( meeter_being, ATTENTION_BODY, groomloc );

            episodic_interaction( meeter_being, met_being, EVENT_GROOM, AFFECT_GROOM, groomloc );
            episodic_interaction( met_being, meeter_being, EVENT_GROOMED, AFFECT_GROOM, groomloc );

            
            meeter_index = social_meet( meeter_being, met_being, LOCATION_KNOWN );
            if ( meeter_index > -1 )
            {
                met_index = social_meet( met_being, meeter_being, LOCATION_KNOWN );
                if ( met_index > -1 )
                {
var graph = being_social( meeter_being );
                    if ( !graph )
                    {
                        return 0;
                    }

                    if ( ( graph[meeter_index].friend_foe ) < 255 )
                    {
                        graph[meeter_index].friend_foe++;
                    }
                    if ( ( graph[met_index].friend_foe ) < 255 )
                    {
                        graph[met_index].friend_foe++;
                    }
                }
            }
            
            being_honor_inc_dec( meeter_being, met_being );

            

            being_remove_parasites( met_being, PARASITES_REMOVED );

            grooming = 1;
        }
    }

    return grooming;
}

function social_squabble(meeter_being, met_being, distance, is_female, group) {
var _tmp = 0;
    var agro;
var ret_val = 0;
    var victor,  vanquished;
    var victor_index, vanquished_index;
    var punchloc;
    var delta = vect2_new();

    
    being_delta( met_being, meeter_being, delta );

    
    if ( ( being_family_first_name( meeter_being ) != being_family_first_name( met_being ) ) &&
            ( being_family_second_name( meeter_being ) != being_family_second_name( met_being ) ) )
    {
        being_facing_towards( meeter_being, delta );
        
        agro = GENE_AGGRESSION( being_genetics( meeter_being ) );
        
        if ( is_female )
        {
            agro >>= 3;
        }
        if ( being_random( meeter_being ) < ( agro * 4096 + agro * being_honor( meeter_being ) * 10 ) )
        {
            
            victor = meeter_being;
            vanquished = met_being;

            if ( ( ( being_random( meeter_being ) & 7 )*being_energy( meeter_being ) ) <
                    ( ( being_random( meeter_being ) & 7 )*being_energy( met_being ) ) )
            {
                victor = met_being;
                vanquished = meeter_being;
            }

            vanquished_index = social_meet( victor, vanquished, LOCATION_KNOWN );
            if ( vanquished_index > -1 )
            {
                victor_index = social_meet( vanquished, victor, LOCATION_KNOWN );
                if ( victor_index > -1 )
                {
var victor_social_graph = being_social( victor );
var vanquished_social_graph = being_social( vanquished );

                    if ( ( !victor_social_graph ) || ( !vanquished_social_graph ) )
                    {
                        return 0;
                    }

                    
                    if ( victor_social_graph[vanquished_index].friend_foe > SQUABBLE_DISRESPECT )
                    {
                        victor_social_graph[vanquished_index].friend_foe -= SQUABBLE_DISRESPECT;
                    }
                    
                    if ( vanquished_social_graph[victor_index].friend_foe > SQUABBLE_DISRESPECT )
                    {
                        vanquished_social_graph[victor_index].friend_foe -= SQUABBLE_DISRESPECT;
                    }
                }
            }
            
            if ( being_honor( victor ) < 255 - SQUABBLE_HONOR_ADJUST )
            {
                being_honor_delta( victor, SQUABBLE_HONOR_ADJUST );
            }
            
            if ( being_honor( vanquished ) > SQUABBLE_HONOR_ADJUST )
            {
                being_honor_delta( vanquished, 0 - SQUABBLE_HONOR_ADJUST );
            }

            punchloc = being_random( victor ) % INVENTORY_SIZE;
            if ( distance > SQUABBLE_SHOW_FORCE_DISTANCE )
            {
                
                vanquished.changes.inventory[punchloc] = 0;
                being_energy_delta( victor, 0 - SQUABBLE_ENERGY_SHOWFORCE );
                being_energy_delta( vanquished, 0 - SQUABBLE_ENERGY_SHOWFORCE );

                ret_val |= BEING_STATE_SHOWFORCE;
            }
            else
            {
                
                vanquished.changes.inventory[punchloc] = INVENTORY_WOUND;
                being_energy_delta( victor, 0 - SQUABBLE_ENERGY_ATTACK );
                being_energy_delta( vanquished, 0 - SQUABBLE_ENERGY_ATTACK );
                being_honor_swap( victor, vanquished );
                ret_val |= BEING_STATE_ATTACK;
            }

            

            episodic_interaction( victor, vanquished, EVENT_HIT, AFFECT_SQUABBLE_VICTOR, punchloc );
            episodic_interaction( vanquished, victor, EVENT_HIT_BY, AFFECT_SQUABBLE_VANQUISHED, punchloc );

            
            if ( meeter_being == vanquished )
            {
                var negative_delta, zero = [0];

                vect2_subtract( negative_delta, zero, delta );

                being_facing_towards( vanquished, negative_delta );
            }
            else
            {
                being_facing_towards( vanquished, delta );
            }

            
            being_set_speed( vanquished, SQUABBLE_FLEE_SPEED );
        }
        return ret_val;
    }
    return 0;
}

function social_respect_mean(local_being) {
var _tmp = 0;
var simulated_isocials = 0, average = 0;
    var local_social_graph;
    var i;

    local_social_graph = being_social( local_being );
    if ( !local_social_graph )
    {
        return 0;
    }

    
    for ( i = 0; i < SOCIAL_SIZE; i++ )
    {
        if ( !SOCIAL_GRAPH_ENTRY_EMPTY( local_social_graph, i ) )
        {
            simulated_isocials++;
            average += ( local_social_graph[i].friend_foe );
        }
    }
    if ( simulated_isocials > 0 )
    {
        return average / simulated_isocials;
    }
    return SOCIAL_RESPECT_NORMAL;
}

function social_conception(female, male, group) {
var _tmp = 0;

    if ( ( male == 0 ) || ( female == 0 ) )
    {
        return;
    }

    body_genetics( group.beings, group.num, being_fetal_genetics( female ), being_genetics( female ), being_genetics( male ), female.delta.random_seed );

    
    female.changes.date_of_conception = land_date();

    female.changes.father_name[0]   = male.constant.name[0];
    female.changes.father_name[1]   = male.constant.name[1];

    if ( male.constant.generation_min < female.constant.generation_min )
    {
        female.changes.child_generation_min = male.constant.generation_min;
    }
    else
    {
        female.changes.child_generation_min = female.constant.generation_min;
    }

    if ( male.constant.generation_max > female.constant.generation_max )
    {
        female.changes.child_generation_max = male.constant.generation_max;
    }
    else
    {
        female.changes.child_generation_max = female.constant.generation_max;
    }

    
    being_reset_drive( female, DRIVE_SEX );
    being_reset_drive( male, DRIVE_SEX );

    being_set_goal_none( female );
    being_set_goal_none( male );

    
    episodic_interaction( female, male, EVENT_MATE,  ( GENE_MATE_BOND( being_genetics( female ) )*AFFECT_MATE ), 0 );
    episodic_interaction( male, female, EVENT_MATE,  ( GENE_MATE_BOND( being_genetics( male ) )*AFFECT_MATE ), 0 );
}

function social_mate(meeter_being, met_being, being_index, distance, group) {
var _tmp = 0;
var loc_state = 0;
var attraction = 0;
    var attract;
    
var meeter_social_graph = being_social( meeter_being );

    if ( !meeter_social_graph )
    {
        return -1;
    }

    
    {

        

        
        {


            
            attraction = 1 +
                         social_attraction_pheromone( meeter_being, met_being ) +
                         social_attraction_pigmentation( meeter_being, met_being ) +
                         social_attraction_height( meeter_being, met_being ) +
                         social_attraction_frame( meeter_being, met_being ) +
                         social_attraction_hair( meeter_being, met_being )

                         + episodic_met_being_celebrity( meeter_being, met_being )

                         ;

            
            
            if ( distance < MATING_RANGE )
            {
                
                immune_transmit( meeter_being.immune_system, met_being.immune_system, PATHOGEN_TRANSMISSION_SEX );
                immune_transmit( met_being.immune_system, meeter_being.immune_system, PATHOGEN_TRANSMISSION_SEX );
                
                if ( ( FIND_SEX( GET_I( meeter_being ) ) == SEX_FEMALE ) &&
                        ( FIND_SEX( GET_I( met_being ) ) != SEX_FEMALE ) )
                {
                    if ( being_pregnant( meeter_being ) == 0 )
                    {
                        social_conception( meeter_being, met_being, group );
                    }
                }
            }
            
        }

        attract = meeter_social_graph[being_index].attraction;
        if ( attraction > 0 )
        {
            if ( attraction < PAIR_BOND_THRESHOLD * 4 )
            {
                if ( attract < 255 - attraction )
                {
                    attract += attraction;
                }
            }
        }
        else
        {
            if ( attract > -attraction )
            {
                attract += attraction;
            }
            else
            {
                attract = 0;
            }
        }
        meeter_social_graph[being_index].attraction = attract; 
    }
    return loc_state;
}

function social_chat_territory(meeter_being, met_being, being_index, meeter_graph, respect_mean) {
var _tmp = 0;

var idx = 0, idx2, i = 0, x, y;

    idx = APESPACE_TO_TERRITORY( being_location_y( meeter_being ) ) * TERRITORY_DIMENSION +
          APESPACE_TO_TERRITORY( being_location_x( meeter_being ) );
    if ( meeter_being.events.territory[idx].name == 0 )
    {
        i = 0;
        for ( y = -1; y <= 1; y++ )
        {
            for ( x = -1; x <= 1; x++ )
            {
                if ( !( ( x == 0 ) && ( y == 0 ) ) )
                {
                    idx2 = idx + ( y * TERRITORY_DIMENSION + x );
                    if ( idx2 < 0 )
                    {
                        idx2 += TERRITORY_AREA;
                    }
                    if ( idx2 >= TERRITORY_AREA )
                    {
                        idx2 -= TERRITORY_AREA;
                    }
                    i = meeter_being.events.territory[idx2].name;
                    if ( i > 0 )
                    {
                        y = 2;
                        break;
                    }
                }
            }
        }
        
        if ( i == 0 )
        {
            i = 1 + ( being_random( meeter_being ) & 255 );
        }
        meeter_being.events.territory[idx].name = i;
    }

    
    if ( meeter_graph[being_index].friend_foe >= respect_mean )
    {
        if ( being_honor_compare( met_being, meeter_being ) == 1 )
        {
            if ( met_being.events.territory[idx].name > 0 )
            {
                meeter_being.events.territory[idx].name =
                    met_being.events.territory[idx].name;
            }
        }
        else
        {
            if ( ( being_honor_compare( met_being, meeter_being ) == -1 ) &&
                    ( meeter_being.events.territory[idx].name > 0 ) )
            {
                met_being.events.territory[idx].name =
                    meeter_being.events.territory[idx].name;
            }
        }
    }

}

function social_chat(meeter_being, met_being, being_index, group) {
var _tmp = 0;
    var idx, i = 0;
    var relationship_index;
    var name, family;
    var replace;
var speaking = 0;
var meeter_graph = being_social( meeter_being );
var met_graph = being_social( met_being );
var respect_mean = social_respect_mean( meeter_being );


    if ( !meeter_graph )
    {
        return 0;
    }

    if ( !met_graph )
    {
        return 0;
    }

    
    social_chat_territory( meeter_being, met_being, being_index, meeter_graph, respect_mean );

    
    if ( ( meeter_graph[being_index].friend_foe ) >= respect_mean )
    {
        episodic_interaction( meeter_being, met_being, EVENT_CHAT, AFFECT_CHAT, 0 );
        
        idx = -1;

        if ( being_check_goal( meeter_being, GOAL_MATE ) )
        {
            
            for ( i = 1; i < SOCIAL_SIZE_BEINGS; i++ )
            {
                if ( !SOCIAL_GRAPH_ENTRY_EMPTY( met_graph, i ) )
                {
                    if ( ( met_graph[i].first_name[BEING_MET] == meeter_being.delta.goal[1] ) &&
                            ( met_graph[i].family_name[BEING_MET] == meeter_being.delta.goal[2] ) )
                    {
                        idx = i;
                        break;
                    }
                }
            }
        }
        if ( idx == -1 )
        {
            
            relationship_index = being_attention( meeter_being, ATTENTION_RELATIONSHIP );
            if ( relationship_index > 0 )
            {
                idx = social_get_relationship( meeter_being, relationship_index );
            }
            else
            {
                
                idx = 1 + ( being_random( meeter_being ) % ( SOCIAL_SIZE_BEINGS - 1 ) );
            }
        }

        if ( idx > -1 )
        {
            
            name = met_graph[idx].first_name[BEING_MET];
            family = met_graph[idx].family_name[BEING_MET];
            if ( !( ( name == 0 ) && ( family == 0 ) ) )
            {
                for ( i = 1; i < SOCIAL_SIZE_BEINGS; i++ )
                {
                    if ( !SOCIAL_GRAPH_ENTRY_EMPTY( meeter_graph, i ) )
                    {
                        if ( ( meeter_graph[i].first_name[BEING_MET] == name ) &&
                                ( meeter_graph[i].family_name[BEING_MET] == family ) )
                        {
                            break;
                        }
                    }
                }

                if ( i < SOCIAL_SIZE_BEINGS )
                {
                    
                    if ( being_honor_compare( met_being, meeter_being ) == 1 )
                    {
                        meeter_graph[i].friend_foe++;
                    }
                    if ( being_honor_compare( met_being, meeter_being ) == -1 )
                    {
                        meeter_graph[i].friend_foe--;
                    }
                    if ( meeter_graph[i].familiarity < 65535 )
                    {
                        meeter_graph[i].familiarity++;
                    }

                    
                    if ( spacetime_after( met_graph[idx].space_time, meeter_graph[i].space_time ) )
                    {
                        
                        spacetime_copy( meeter_graph[i].space_time, met_graph[idx].space_time );

                        
                        meeter_graph[i].belief = met_graph[idx].belief;
                    }
                    speaking |= BEING_STATE_SPEAKING;
                }
                else
                {
                    
                    replace = get_stranger_link( meeter_being, met_being );
                    if ( replace > -1 )
                    {
                        memory_copy( met_graph[idx], meeter_graph[replace], sizeof("simulated_isocial") );
                        meeter_graph[replace].attraction = 0;
                        speaking |= BEING_STATE_SPEAKING;

                        
                        if ( IS_FAMILY_MEMBER( met_graph, idx ) )
                        {
                            meeter_graph[replace].relationship =
                                meeter_graph[replace].relationship + ( OTHER_MOTHER - RELATIONSHIP_MOTHER );
                        }

                        
                        being_init_braincode( meeter_being, met_being, met_graph[idx].friend_foe, BRAINCODE_EXTERNAL );

                    }
                }
            }
        }
    }
    being_reset_drive( met_being, DRIVE_SOCIAL );
    being_reset_drive( meeter_being, DRIVE_SOCIAL );


    brain_dialogue(
        group, 1, meeter_being, met_being,
        being_braincode_external( meeter_being ),
        being_braincode_external( met_being ),
        being_index );



    social_group_align_preferences(
        group, meeter_being, met_being, being_index );

    if ( speaking != 0 )
    {
        being_add_state( meeter_being, BEING_STATE_SPEAKING );
        being_add_state( met_being, BEING_STATE_SPEAKING );
    }
    return speaking;
}

function social_goals(local) {
var _tmp = 0;
    if ( being_check_goal( local, GOAL_LOCATION ) )
    {
        

var delta_x = 0, delta_y = 0, distsqr;
        var delta_vector = vect2_new();
        var location_vector = vect2_new();

        if ( ( being_state( local ) & BEING_STATE_SWIMMING ) == 0 )
        {
            vect2_byte2( delta_vector,   ( local.delta.goal[1] ) );
            being_space( local, location_vector );
            vect2_subtract( delta_vector, location_vector, delta_vector );
            being_facing_towards( local, delta_vector );
        }

        distsqr = delta_x * delta_x + delta_y * delta_y;
        if ( ( distsqr < GOAL_RADIUS ) || ( ( being_state( local ) & BEING_STATE_SWIMMING ) != 0 ) )
        {
            
            being_set_goal_none( local );
            
            local.braindata.script_overrides -= OVERRIDE_GOAL;
        }
    }
    being_goal_cycle( local );
}

function social_initial_loop(group, local_being, data) {
var _tmp = 0;
var respect_mean = social_respect_mean( local_being );
var social_loop = 0;
    var location = vect2_new();
    var sum_delta = vect2_new();
var familiar_being_count = 0;
    vect2_byte2( location,   ( local_being.delta.social_coord_x ) );
    while ( social_loop < SOCIAL_SIZE_BEINGS )
    {
var specific_individual = ( being_social( local_being )[social_loop] );
        var specific_being = 0;

        if ( !specific_individual )
        {
            return;
        }

        if ( !SOCIAL_GRAPH_ENTRY_EMPTY( being_social( local_being ), social_loop ) )
        {
            specific_being = being_find_name( group, specific_individual.first_name[BEING_MET], specific_individual.family_name[BEING_MET] );

            if ( specific_being != 0 )
            {
                var weighted_delta = vect2_new();
                var familiar_location = vect2_new();
var local_friend_or_foe = specific_individual.friend_foe;
                var distance_squared;

                local_friend_or_foe -= respect_mean;

                familiar_being_count++;

                vect2_byte2( familiar_location,   ( specific_being.delta.social_coord_x ) );

                vect2_subtract( weighted_delta, familiar_location, location );

                distance_squared = vect2_dot( weighted_delta, weighted_delta, 1, 512 );

                if ( distance_squared < 0 )
                {
                    distance_squared = 0;    
                }

                vect2_d( sum_delta, weighted_delta, local_friend_or_foe * 2048,
                         ( distance_squared + 1 ) );
            }
        }

        social_loop++;
    }

    if ( familiar_being_count != 0 )
    {
        vect2_d( location, sum_delta, 1, ( familiar_being_count * 20 ) );
    }
    vect2_back_byte2( location,   ( local_being.delta.social_coord_nx ) );
}

function social_secondary_loop_no_sim(local_being) {
var _tmp = 0;
    local_being.delta.social_coord_x = local_being.delta.social_coord_nx;
    local_being.delta.social_coord_y = local_being.delta.social_coord_ny;
}
