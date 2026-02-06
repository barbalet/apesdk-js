
/****************************************************************

 body.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }

function body_action_give(local, other, carrying) {
var _tmp = 0;
var hand = BODY_RIGHT_HAND;

    if ( carrying == 0 )
    {
        hand = BODY_LEFT_HAND;
        carrying = being_carried( local, hand );
    }
    if ( ( carrying != 0 ) &&
            ( ( being_carried( other, BODY_LEFT_HAND ) == 0 ) ||
              ( being_carried( other, BODY_RIGHT_HAND ) == 0 ) ) )
    {
        being_set_attention( local, ATTENTION_BODY, BODY_RIGHT_HAND );
        being_set_attention( other, ATTENTION_BODY, BODY_RIGHT_HAND );

        episodic_interaction( local, other, EVENT_GIVEN, EPISODIC_AFFECT_ZERO, carrying );
        episodic_interaction( other, local, EVENT_GIVEN_BY, AFFECT_RECEIVE, carrying );

        being_drop( local, hand );
        if ( being_carried( other, BODY_RIGHT_HAND ) == 0 )
        {
            being_take( other, BODY_RIGHT_HAND, carrying );
        }
        else
        {
            being_take( other, BODY_LEFT_HAND, carrying );
        }
    }
}

function body_action_bash(local, other, carrying) {
var _tmp = 0;
var hand = BODY_RIGHT_HAND;
    var index, hit = 0;
    var graph;

    if ( carrying == 0 )
    {
        hand = BODY_LEFT_HAND;
        carrying = being_carried( local, hand );
    }
    if ( carrying != 0 )
    {
        if ( ( carrying & INVENTORY_BRANCH ) || ( carrying & INVENTORY_ROCK ) )
        {
            being_set_attention( local, ATTENTION_BODY, BODY_RIGHT_HAND );
            being_set_attention( other, ATTENTION_BODY, BODY_BACK );
            index = get_simulated_isocial( other, local );
            if ( index > -1 )
            {
                graph = being_social( other );
                if ( !graph )
                {
                    return;
                }
                if ( graph[index].friend_foe > 1 )
                {
                    graph[index].friend_foe -= 2;
                }
            }
            if ( ( carrying & INVENTORY_ROCK ) && ( being_random( other ) > THROW_ACCURACY ) )
            {
                hit = 1;
                being_energy_delta( other, 0 - SQUABBLE_ENERGY_ROCK_HURL );
            }
            if ( ( carrying & INVENTORY_BRANCH ) && ( being_random( other ) > WHACK_ACCURACY ) )
            {
                hit = 1;
                being_energy_delta( other, 0 - SQUABBLE_ENERGY_BRANCH_WHACK );
            }
        }
        if ( carrying & INVENTORY_BRANCH )
        {
            if ( hit != 0 )
            {
                episodic_interaction( local, other, EVENT_WHACKED, EPISODIC_AFFECT_ZERO, 0 );
                episodic_interaction( other, local, EVENT_WHACKED_BY, AFFECT_WHACKED, 0 );
            }
        }
        if ( carrying & INVENTORY_ROCK )
        {
            episodic_interaction( local, other, EVENT_HURLED, EPISODIC_AFFECT_ZERO, 0 );
            if ( hit != 0 )
            {
                episodic_interaction( other, local, EVENT_HURLED_BY, AFFECT_HURL, 0 );
            }
        }
    }

}

function body_action_interactive(local, other, local_attention, other_attention, kind) {
var _tmp = 0;
    being_set_attention( local, ATTENTION_BODY, local_attention );
    being_set_attention( other, ATTENTION_BODY, other_attention );
    episodic_interaction( local, other, kind, EPISODIC_AFFECT_ZERO, 0 );
    episodic_interaction( other, local, kind + 1, EPISODIC_AFFECT_ZERO, 0 );
}

function body_action_interactive_change(local, other, local_attention, other_attention, kind, positive, affect) {
var _tmp = 0;
    var index;
    being_set_attention( local, ATTENTION_BODY, local_attention );
    being_set_attention( other, ATTENTION_BODY, other_attention );
    index = get_simulated_isocial( other, local );
    if ( index > -1 )
    {
var graph = being_social( other );
        if ( !graph )
        {
            return;
        }
        if ( positive )
        {
            if ( graph[index].friend_foe < 255 )
            {
                graph[index].friend_foe++;
            }
        }
        else
        {
            if ( graph[index].friend_foe > 0 )
            {
                graph[index].friend_foe--;
            }
        }
    }

    episodic_interaction( local, other, kind, EPISODIC_AFFECT_ZERO, 0 );
    episodic_interaction( other, local, kind + 1, affect, 0 );
}

function body_action_hand_object(local, carrying, hand, kind) {
var _tmp = 0;
    if ( carrying == 0 )
    {
        hand = BODY_LEFT_HAND;
        carrying = being_carried( local, hand );
    }

    if ( carrying != 0 )
    {
        if ( carrying & INVENTORY_BRANCH )
        {
            episodic_self( local, kind, EPISODIC_AFFECT_ZERO, INVENTORY_BRANCH );
        }
        else
        {
            if ( carrying & INVENTORY_TWIG )
            {
                episodic_self( local, kind, EPISODIC_AFFECT_ZERO, INVENTORY_TWIG );
            }
            else
            {
                if ( carrying & INVENTORY_SPEAR )
                {
                    episodic_self( local, kind, EPISODIC_AFFECT_ZERO, INVENTORY_SPEAR );
                }
            }
        }
    }

}

function body_action_jab(local, carrying, hand) {
var _tmp = 0;
var carrying2 = being_carried( local, BODY_LEFT_HAND );
    if ( ( carrying & INVENTORY_SPEAR ) ||
            ( carrying2 & INVENTORY_SPEAR ) )
    {
        var az;
        var location_vector = vect2_new();
        var facing_vector = vect2_new();
        var slope_vector = vect2_new();

        being_space( local, location_vector );

        being_facing_vector( local, facing_vector, 4 );
        az = land_vect2( slope_vector, az, location_vector );

        if ( ( az > WATER_MAP ) && ( az < TIDE_MAX ) )
        {
            
            if ( being_random( local ) < FISHING_PROB )
            {
                
                if ( carrying & INVENTORY_SPEAR )
                {
                    being_take( local, BODY_LEFT_HAND, INVENTORY_FISH );
                }
                else
                {
                    being_take( local, hand, INVENTORY_FISH );
                }

                episodic_self( local, EVENT_FISH, AFFECT_FISH, 0 );

            }
        }
    }
}

function body_action_bash_objects(local, carrying, hand) {
var _tmp = 0;
var carrying2 = being_carried( local, BODY_LEFT_HAND );
    if ( ( carrying & INVENTORY_ROCK ) && ( carrying2 & INVENTORY_ROCK ) )
    {
        
        being_drop( local, hand );
        being_take( local, hand, INVENTORY_SCRAPER );
    }
    if ( ( ( carrying & INVENTORY_ROCK ) && ( carrying2 & INVENTORY_NUT ) ) ||
            ( ( carrying & INVENTORY_NUT ) && ( carrying2 & INVENTORY_ROCK ) ) )
    {
        
        if ( carrying & INVENTORY_NUT )
        {
            being_drop( local, hand );
            being_take( local, hand, INVENTORY_NUT_CRACKED );
        }
        else
        {
            being_drop( local, BODY_LEFT_HAND );
            being_take( local, BODY_LEFT_HAND, INVENTORY_NUT_CRACKED );
        }
    }
    if ( ( ( carrying & INVENTORY_BRANCH ) && ( carrying2 & INVENTORY_SCRAPER ) ) ||
            ( ( carrying & INVENTORY_SCRAPER ) && ( carrying2 & INVENTORY_BRANCH ) ) )
    {
        
        if ( carrying & INVENTORY_BRANCH )
        {
            being_drop( local, hand );
            being_take( local, hand, INVENTORY_SPEAR );
        }
        else
        {
            being_drop( local, BODY_LEFT_HAND );
            being_take( local, BODY_LEFT_HAND, INVENTORY_SPEAR );
        }
    }
    if ( ( ( carrying & INVENTORY_BRANCH ) && ( carrying2 & INVENTORY_NUT ) ) ||
            ( ( carrying & INVENTORY_NUT ) && ( carrying2 & INVENTORY_BRANCH ) ) )
    {
        
        if ( carrying & INVENTORY_NUT )
        {
            being_drop( local, hand );
            being_take( local, hand, INVENTORY_NUT_CRACKED );
        }
        else
        {
            being_drop( local, BODY_LEFT_HAND );
            being_take( local, BODY_LEFT_HAND, INVENTORY_NUT_CRACKED );
        }
    }
}

function body_action_chew(local, carrying, hand) {
var _tmp = 0;
    if ( !( ( carrying & INVENTORY_GRASS ) ||
            ( carrying & INVENTORY_TWIG ) ||
            ( carrying & INVENTORY_FISH ) ||
            ( carrying & INVENTORY_BIRD_EGGS ) ||
            ( carrying & INVENTORY_LIZARD_EGGS ) ||
            ( carrying & INVENTORY_NUT_CRACKED ) ) )
    {
        hand = BODY_LEFT_HAND;
        carrying = being_carried( local, hand );
    }
    if ( ( carrying & INVENTORY_GRASS ) ||
            ( carrying & INVENTORY_TWIG ) ||
            ( carrying & INVENTORY_FISH ) ||
            ( carrying & INVENTORY_BIRD_EGGS ) ||
            ( carrying & INVENTORY_LIZARD_EGGS ) ||
            ( carrying & INVENTORY_NUT_CRACKED ) )
    {
        if ( hand == BODY_RIGHT_HAND )
        {
            carrying |= 1;
        }

        episodic_self( local, EVENT_CHEW, EPISODIC_AFFECT_ZERO, carrying );

    }
    if ( carrying & INVENTORY_GRASS )
    {
        
        being_energy_delta( local, food_absorption( local, ENERGY_GRASS, FOOD_VEGETABLE ) );
        being_drop( local, hand );
    }
    else
    {
        if ( carrying & INVENTORY_FISH )
        {
            
            being_energy_delta( local, food_absorption( local, ENERGY_FISH, FOOD_SHELLFISH ) );
            being_drop( local, hand );
        }
        else
        {
            if ( carrying & INVENTORY_NUT_CRACKED )
            {
                
                being_energy_delta( local, food_absorption( local, ENERGY_NUT, FOOD_VEGETABLE ) );
                being_drop( local, hand );
            }
            else
            {
                if ( carrying & INVENTORY_BIRD_EGGS )
                {
                    
                    being_energy_delta( local, food_absorption( local, ENERGY_BIRD_EGGS, FOOD_BIRD_EGGS ) );
                    being_drop( local, hand );
                }
                else
                {
                    if ( carrying & INVENTORY_LIZARD_EGGS )
                    {
                        
                        being_energy_delta( local, food_absorption( local, ENERGY_LIZARD_EGGS, FOOD_LIZARD_EGGS ) );
                        being_drop( local, hand );
                    }
                }
            }
        }
    }
}

function body_action_swap_hands(local, carrying, hand) {
var _tmp = 0;
    if ( ( carrying != 0 ) && ( being_carried( local, BODY_LEFT_HAND ) == 0 ) )
    {
        being_drop( local, hand );
        being_take( local, BODY_LEFT_HAND, carrying );
    }
    else
    {
        if ( ( carrying == 0 ) && ( being_carried( local, BODY_LEFT_HAND ) != 0 ) )
        {
            carrying = being_carried( local, BODY_LEFT_HAND );
            being_drop( local, BODY_LEFT_HAND );
            being_take( local, hand, carrying );
        }
    }
}

function body_action_drop(local, carrying, hand) {
var _tmp = 0;
    if ( carrying == 0 )
    {
        hand = BODY_LEFT_HAND;
        carrying = being_carried( local, hand );
    }
    if ( carrying != 0 )
    {
        being_drop( local, hand );

        episodic_self( local, EVENT_DROP, EPISODIC_AFFECT_ZERO, carrying );

    }
}

function body_action_pickup(local, carrying, hand) {
var _tmp = 0;
    if ( ( carrying != 0 ) && ( !being_posture_under( local, POSTURE_CROUCHING ) ) )
    {
        hand = BODY_LEFT_HAND;
        carrying = being_carried( local, hand );
    }
    if ( carrying == 0 )
    {
        var az;
        var location_vector = vect2_new();
        var facing_vector = vect2_new();
        var slope_vector = vect2_new();
        being_space( local, location_vector );
        being_facing_vector( local, facing_vector, 4 );
        az = land_vect2( slope_vector, az, location_vector );

        if ( az > WATER_MAP )
        {
            if ( az > TIDE_MAX )
            {
                

                var food = food_values( being_location_x( local ), being_location_y( local ) );
                var grass = food.grass;
                var trees = food.trees;
                var bush = food.bush;


                if ( ( grass > bush ) && ( grass > trees ) )
                {
                    being_take( local, hand, INVENTORY_GRASS );

                    episodic_self( local, EVENT_PICKUP, EPISODIC_AFFECT_ZERO, INVENTORY_GRASS );

                }
                if ( ( trees > grass ) && ( trees > bush ) )
                {
                    if ( being_posture_under( local, POSTURE_UPRIGHT ) )
                    {
                        being_take( local, hand, INVENTORY_BRANCH );

                        episodic_self( local, EVENT_PICKUP, EPISODIC_AFFECT_ZERO, INVENTORY_BRANCH );

                    }
                    else
                    {
                        being_take( local, hand, INVENTORY_NUT );

                        episodic_self( local, EVENT_PICKUP, EPISODIC_AFFECT_ZERO, INVENTORY_NUT );

                    }
                }
                if ( ( bush > grass ) && ( bush > trees ) )
                {
                    being_take( local, hand, INVENTORY_TWIG );

                    episodic_self( local, EVENT_PICKUP, EPISODIC_AFFECT_ZERO, INVENTORY_TWIG );

                }
            }
            else
            {
                being_take( local, hand, INVENTORY_ROCK );

                episodic_self( local, EVENT_PICKUP, EPISODIC_AFFECT_ZERO, INVENTORY_ROCK );

            }
        }
    }
}

function social_action(local, other, action) {
var _tmp = 0;
    var carrying;
var hand = BODY_RIGHT_HAND;

    if ( local.delta.awake == FULLY_ASLEEP )
    {
        return;
    }

    carrying = being_carried( local, hand );
    if ( other == 0 )
    {
        
        switch ( action % INDIVIDUAL_ACTIONS )
        {
        case ACTION_JAB:
            body_action_jab( local, carrying, hand );
            break;
        case ACTION_BASH_OBJECTS:
            body_action_bash_objects( local, carrying, hand );
            break;
        case ACTION_CHEW:
            body_action_chew( local, carrying, hand );
            break;
        case ACTION_BRANDISH:
            body_action_hand_object( local, carrying, hand, EVENT_BRANDISH );
            break;
        case ACTION_DRAG:
            body_action_hand_object( local, carrying, hand, EVENT_DRAG );
            break;
        case ACTION_SWAP_HANDS:
            body_action_swap_hands( local, carrying, hand );
            break;
        case ACTION_DROP:
            body_action_drop( local, carrying, hand );
            break;
        case ACTION_PICKUP:
            body_action_pickup( local, carrying, hand );
            break;
        }
    }
    else
    {
        
        switch ( action % SOCIAL_ACTIONS )
        {
        case ACTION_PROD:
            body_action_interactive_change( local, other, BODY_RIGHT_HAND, BODY_FRONT,
                                            EVENT_PRODDED, 0, AFFECT_PRODDED );
            break;
        case ACTION_HUG:
            body_action_interactive_change( local, other, BODY_FRONT, BODY_FRONT,
                                            EVENT_HUGGED, 1, AFFECT_HUGGED );
            break;
        case ACTION_SMILE:
            body_action_interactive_change( local, other, BODY_TEETH, BODY_TEETH,
                                            EVENT_SMILED, 1, AFFECT_SMILED );
            break;
        case ACTION_GLOWER:
            body_action_interactive_change( local, other, BODY_HEAD, BODY_HEAD,
                                            EVENT_GLOWERED, 0, AFFECT_GLOWER );
            break;
        case ACTION_TICKLE:
            body_action_interactive( local, other, BODY_RIGHT_HAND, BODY_FRONT, EVENT_TICKLED );
            break;
        case ACTION_POINT:
            body_action_interactive( local, other, BODY_RIGHT_HAND, BODY_RIGHT_HAND, EVENT_POINT );
            break;
        case ACTION_PAT:
            body_action_interactive( local, other, BODY_RIGHT_HAND, BODY_BACK, EVENT_PATTED );
            break;
        case ACTION_BASH:
            body_action_bash( local, other, carrying );
            break;
        case ACTION_GIVE:
            body_action_give( local, other, carrying );
            break;
        }
    }
}

function genetics_compare(genetics_a, genetics_b) {
var _tmp = 0;
var loop = 0;

    while ( loop < CHROMOSOMES )
    {
        if ( genetics_a[loop] != genetics_b[loop] )
        {
            return 0;
        }
        loop++;
    }
    return 1;
}

function genetics_set(genetics_a, genetics_b) {
var _tmp = 0;
var loop = 0;
    while ( loop < CHROMOSOMES )
    {
        genetics_a[loop] = genetics_b[loop];
        loop++;
    }
}

function genetics_zero(genetics_a) {
var _tmp = 0;
var loop = 0;
    while ( loop < CHROMOSOMES )
    {
        genetics_a[loop] = 0;
        loop++;
    }
}

function genetics_unique(local, number, genetics) {
var _tmp = 0;
var loop = 0;
    if ( number == 0 )
    {
        return 1;
    }
    while ( loop < number )
    {
var local_being = ( local[loop] );
        if ( genetics_compare( being_genetics( local_being ), genetics ) )
        {
            return 0;
        }
        loop++;
    }
    return 1;
}

function genetics_child_gene(chromosome, point, mutation_prob, local) {
var _tmp = 0;
    var mutation_type;
var child_gene = 0;

    math_random3( local );
    if ( math_random( local ) < mutation_prob )
    {
        mutation_type = ( math_random( local ) & 7 );
        switch ( mutation_type )
        {
        
        case MUTATION_MATERNAL:
            child_gene = DIPLOID(
                             ( math_random( local ) & 3 ),
                             ( ( CHROMOSOME_FROM_FATHER( chromosome ) >> point ) & 3 ) );
            break;
        
        case MUTATION_PATERNAL:
            child_gene = DIPLOID(
                             ( ( CHROMOSOME_FROM_MOTHER( chromosome ) >> point ) & 3 ),
                             ( math_random( local ) & 3 ) );
            break;
        
        case MUTATION_MATERNAL_DUPLICATE:
            child_gene = DIPLOID(
                             ( ( CHROMOSOME_FROM_MOTHER( chromosome ) >> point ) & 3 ),
                             ( ( CHROMOSOME_FROM_MOTHER( chromosome ) >> point ) & 3 ) );
            break;
        
        case MUTATION_PATERNAL_DUPLICATE:
            child_gene = DIPLOID(
                             ( ( CHROMOSOME_FROM_FATHER( chromosome ) >> point ) & 3 ),
                             ( ( CHROMOSOME_FROM_FATHER( chromosome ) >> point ) & 3 ) );
            break;
        default:
            math_random3( local );

            child_gene = DIPLOID(
                             ( math_random( local ) & 3 ), ( math_random( local ) & 3 ) );
        }
    }
    else
    {
        
        if ( ( math_random( local ) & 1 ) != 0 )
        {
            child_gene = DIPLOID(
                             ( ( CHROMOSOME_FROM_MOTHER( chromosome ) >> point ) & 3 ),
                             ( ( CHROMOSOME_FROM_FATHER( chromosome ) >> point ) & 3 ) );
        }
        else
        {
            child_gene = DIPLOID(
                             ( ( CHROMOSOME_FROM_FATHER( chromosome ) >> point ) & 3 ),
                             ( ( CHROMOSOME_FROM_MOTHER( chromosome ) >> point ) & 3 ) );
        }
    }
    return child_gene;
}

function genetics_crossover(mother, father, local) {
var _tmp = 0;
var loop = 0;
var result = 0;
    var point, point2;
var deletion_point = 16;
    var prob;
    var parent;

    
var crossover_point = ( math_random( local ) >> 13 ) << 1;

    
    if ( math_random( local ) < MUTATION_DELETION_PROB )
    {
        deletion_point = ( math_random( local ) >> 13 ) << 1;
    }

    point = point2 = crossover_point - 8;
    
    while ( loop < 16 )
    {
        if ( loop == deletion_point )
        {
            point2 -= 2;
        }

        
        if ( point2 < 0 )
        {
            point2 += 16;
        }
        else
        {
            if ( point2 > 15 )
            {
                point2 -= 16;
            }
        }

        if ( loop < 8 )
        {
            parent = father;
            
            prob = MUTATION_CROSSOVER_PROB * 50;
        }
        else
        {
            parent = mother;
            prob = MUTATION_CROSSOVER_PROB;
        }

        result |= ( genetics_child_gene( parent, point2, prob, local ) << point );
        loop += 2;
        point += 2;
        point2 += 2;
    }
    return result;
}

function genetics_mutate(chromosome, local) {
var _tmp = 0;
var result = 0;
var point = 0;
var loop = 0;
var deletion_point = 16;

    
    if ( math_random( local ) < MUTATION_DELETION_PROB )
    {
        deletion_point = ( math_random( local ) >> 13 ) << 1;
    }

    
    point = 0;
    while ( loop < 16 )
    {
        if ( loop == deletion_point )
        {
            point -= 2;
            if ( point < 0 )
            {
                point += 16;
            }
        }
        if ( point > 15 )
        {
            point -= 16;
        }

        result |= ( genetics_child_gene( chromosome, point, MUTATION_CROSSOVER_PROB, local ) << point );
        loop += 2;
        point += 2;
    }
    return result;
}

function genetics_transpose(genetics, local) {
var _tmp = 0;
    math_random3( local );

    if ( math_random( local ) < MUTATION_TRANSPOSE_PROB )
    {
        
        
        
var local_random0 = math_random( local );
var local_random1 = math_random( local );

var source_offset = ( local_random0 >> 8 ) & 31;
var dest_offset   = local_random1 & 31;
        
var inversion     = ( local_random0 >> 13 ) & 1;
var source_ch     = ( local_random1 >> 5 ) % CHROMOSOMES;
var dest_ch       = ( local_random1 >> 7 ) % CHROMOSOMES;
var ctr1          = source_offset;
var p             = 0;
        math_random3( local );

        while ( p < ( math_random( local ) & 15 ) )
        {
            var ctr2;
            ctr1 = ( ctr1 & 31 );

            if ( inversion == 0 )
            {
                ctr2 = ( dest_offset + p );
            }
            else
            {
                
                ctr2 = dest_offset - p + 32;
            }
            ctr2 = ( ctr2 & 31 );
            
            if ( ( genetics[dest_ch] & ( 1 << ctr2 ) ) != 0 )
            {
                genetics[dest_ch] ^= ( 1 << ctr2 );
            }
            
            if ( ( genetics[source_ch] & ( 1 << ctr1 ) ) != 0 )
            {
                genetics[dest_ch] |= ( 1 << ctr2 );
            }
            p++;
            ctr1++;
        }
    }
}

function body_genetics(beings, number, genetics, mother_genetics, father_genetics, local) {
var _tmp = 0;
    var ch;
var sex = 2;
    math_random3( local );
    sex |= ( math_random( local ) & 1 );
    do
    {
        math_random3( local );

        
        for ( ch = 0; ch < CHROMOSOMES; ch++ )
        {
            if ( ch != CHROMOSOME_Y )
            {
                genetics[ch] = genetics_crossover( mother_genetics[ch], father_genetics[ch], local );
            }
        }

        
        if ( sex != SEX_FEMALE )
        {
            genetics[CHROMOSOME_Y] = genetics_mutate( father_genetics[CHROMOSOME_Y], local );
        }
        else
        {
            genetics[CHROMOSOME_Y] = genetics_mutate( mother_genetics[CHROMOSOME_Y], local );
        }
        
        genetics_transpose( genetics, local );
        
        genetics[CHROMOSOME_Y] &= ~1;
        genetics[CHROMOSOME_Y] |= sex;
    }
    while ( genetics_unique( beings, number, genetics ) == 0 );
}

function body_genome(maternal, genome, genome_str) {
var _tmp = 0;
var string_point = 0;
    var ch, value;

    var nucleotide = [ 'A', 'T', 'C', 'G' ];
    
    for ( ch = 0; ch < CHROMOSOMES; ch++ )
    {
        
var gene_point = 0;
        while ( gene_point < 16 )
        {
            if ( maternal != 0 )
            {
                
                value = ( CHROMOSOME_FROM_MOTHER( genome[ch] ) >> gene_point ) & 3;
            }
            else
            {
                
                value = ( CHROMOSOME_FROM_FATHER( genome[ch] ) >> gene_point ) & 3;
            }
            genome_str[string_point++] = nucleotide[value];
            gene_point += 2;
        }
    }
    genome_str[string_point] = 0;
}
