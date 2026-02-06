
/****************************************************************

 brain.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var BRAINCODE_MIN_MVB_SPACING = 2;
var BRAINCODE_CONSTANT0_BIT = (64);
var BRAINCODE_CONSTANT1_BIT = (128);
var BRAINCODE_DATA_START = null;
var BRAINCODE_DATA_NUMBER = null;
var BRAINCODE_OPERATORS_START = null;
var BRAINCODE_OPERATORS_NUMBER = null;
var BRAINCODE_CONDITIONALS_START = null;
var BRAINCODE_CONDITIONALS_NUMBER = null;
var BRAINCODE_SENSORS_START = null;
var BRAINCODE_SENSORS_NUMBER = null;
var BRAINCODE_ACTUATORS_START = null;
var BRAINCODE_ACTUATORS_NUMBER = null;
var BRAINCODE_INSTRUCTION = (...args) => (null);
var BRAINCODE_CONSTANT0 = (...args) => (null);
var BRAINCODE_CONSTANT1 = (...args) => (null);
var BRAINCODE_VALUE = (...args) => (null);
var B_SIZE = (32768);
var B_WR = null;
var F_X = (1);
var F_Y = (32);
var F_Z = (1024);
var B_Z = null;
var B_Y = null;
var B_X = null;
var B_FN = (...args) => (null);
var B_P_LH = null;
var B_P_UH = null;
var B_N_LH = null;
var B_N_UH = null;
var IS_CONST0 = null;
var IS_CONST1 = null;

function brain_cycle(local, constants) {
var _tmp = 0;
    var br = new Array(B_SIZE);
var bract = local, obr = local[B_SIZE];
var l_a = constants[0];
var l_c = constants[2];
var l_b = constants[1] + l_c;
var loc = 0;
    var average;
    var obr_tmp;
    var br_tmp;
var count = F_Z;

    memory_copy( bract, br, B_SIZE );

    do
    {
        average = ( B_P_LH + B_N_UH );
        br_tmp = br[loc];
        obr_tmp = obr[loc];

        average *= l_a;
        obr_tmp *= l_c;

        br_tmp *= l_b;
        br_tmp -= obr_tmp;
        average += br_tmp;

        br[loc++] = ( average >> 10 );
        count--;

    }
    while ( count );
    count = B_Z - F_Z;
    do
    {
        average =  br[loc - F_Z];
        average += br[loc - F_Y];
        average += br[loc - F_X];

        br_tmp = br[loc];

        average += br[loc + F_X];
        average += br[loc + F_Y];
        average += br[loc + F_Z];

        obr_tmp = obr[loc];
        average *= l_a;
        obr_tmp *= l_c;
        br_tmp *= l_b;
        br_tmp -= obr_tmp;
        average += br_tmp;
        br[loc++] = ( average >> 10 );
        count--;
    }
    while ( count );
    count = F_Z;
    do
    {
        average = B_P_UH;
        br_tmp = br[loc];
        average += B_N_LH;
        obr_tmp = obr[loc];

        average *= l_a;
        obr_tmp *= l_c;
        br_tmp *= l_b;
        br_tmp -= obr_tmp;
        average += br_tmp;

        br[loc++] = ( average >> 10 );
        count--;
    }
    while ( count );

    memory_copy( bract, obr, B_SIZE );
    memory_copy( br, bract, B_SIZE );

}

function brain_format(instruction, command, value0, value1) {
var _tmp = 0;
var is_constant0 = ( ( command & BRAINCODE_CONSTANT0_BIT ) != 0 );
var is_constant1 = ( ( command & BRAINCODE_CONSTANT1_BIT ) != 0 );

    switch ( instruction )
    {
    case BRAINCODE_AND:
    case BRAINCODE_OR:
    case BRAINCODE_MOV:
    case BRAINCODE_ADD:
    case BRAINCODE_SUB:
    case BRAINCODE_MUL:
    case BRAINCODE_MOD:
        if ( ( !is_constant0 ) && ( !is_constant1 ) )
        {
            return BC_FORMAT_A;
        }
        return BC_FORMAT_C;
        break;
    case BRAINCODE_JMZ:
    case BRAINCODE_JMN:
    case BRAINCODE_DJN:
        return BC_FORMAT_E;
        break;
    case BRAINCODE_SEQ:
    case BRAINCODE_SNE:
    case BRAINCODE_SLT:
        if ( ( !is_constant0 ) && ( !is_constant1 ) )
        {
            return BC_FORMAT_A;
        }
        return BC_FORMAT_F;
        break;
    case BRAINCODE_DAT0:
    case BRAINCODE_DAT1:
    case BRAINCODE_JMP:
        return BC_FORMAT_C;
        break;
    case BRAINCODE_INV:
        if ( is_constant0 )
        {
            return BC_FORMAT_G;
        }

        return BC_FORMAT_H;

        break;
    case BRAINCODE_STP:
    case BRAINCODE_LTP:
        if ( ( is_constant0 ) && ( !is_constant1 ) )
        {
            return BC_FORMAT_F;
        }
        if ( ( is_constant0 ) && ( is_constant1 ) )
        {
            return BC_FORMAT_C;
        }
        if ( ( !is_constant0 ) && ( is_constant1 ) )
        {
            return BC_FORMAT_E;
        }
        break;
    }
    return BC_FORMAT_A;
}

function brain_vc(value, vowel) {
var _tmp = 0;
    if ( vowel )
    {
        switch ( value )
        {
        case 3:
            return 'a';
        case 1:
            return 'e';
        case 2:
            return 'i';
        default:
            return 'o';
        }
    }
    switch ( value )
    {
    case 0:
        return 'v';
    case 1:
        return 'f';
    case 2:
        return 's';
    case 3:
        return 't';
    case 4:
        return 'p';
    case 5:
        return 'b';
    case 6:
        return 'j';
    default:
        return 'm';
    }
}

function brain_longword(output, value) {
var _tmp = 0;
    output[0] = brain_vc( ( value >> 0 ) & 7, 0 );
    output[1] = brain_vc( ( value >> 3 ) & 3, 1 );
    output[2] = brain_vc( ( value >> 5 ) & 7, 0 );
    output[4] = 0;
}

function brain_four_character_byte(value, star, dashes, number) {
var _tmp = 0;
    if ( star )
    {
        value[0] = '*';
    }
    else
    {
        value[0] = ' ';
    }
    if ( dashes )
    {
        value[1] = '-';
        value[2] = '-';
        value[3] = '-';
    }
    else
    {
        value[1] = '0' + ( number / 100 ) % 10;
        value[2] = '0' + ( number / 10 ) % 10;
        value[3] = '0' + ( number / 1 ) % 10;

        if ( value[1] == '0' )
        {
            value[1] = ' ';
            if ( value[2] == '0' )
            {
                value[2] = ' ';
            }
        }
    }
}

function brain_space_nstruction_space(value, instruction) {
var _tmp = 0;
var instruction_string = braincode_mnemonic[instruction];
    value[0] = ' ';
    value[1] = instruction_string[0];
    value[2] = instruction_string[1];
    value[3] = instruction_string[2];
    value[4] = instruction_string[3];
    value[5] = ' ';
}

function brain_three_byte_command(string, response) {
var _tmp = 0;
var command      = response[0];
var value0       = response[1];
var value1       = response[2];
var instruction  = ( command & ( BRAINCODE_CONSTANT0_BIT - 1 ) ) % BRAINCODE_INSTRUCTIONS;
var format       = brain_format( instruction, command, value0, value1 );

    brain_space_nstruction_space( string, instruction );

    switch ( format )
    {
    case BC_FORMAT_A:
        brain_four_character_byte( string[6],  0, 0, value0 );
        brain_four_character_byte( string[10], 0, 0, value1 );
        break;
    case BC_FORMAT_C:
        brain_four_character_byte( string[6],  1, 0, value0 );
        brain_four_character_byte( string[10], 1, 0, value1 );
        break;
    case BC_FORMAT_E:
        brain_four_character_byte( string[6],  0, 0, value0 );
        brain_four_character_byte( string[10], 1, 0, value1 );
        break;
    case BC_FORMAT_F:
        brain_four_character_byte( string[6],  1, 0, value0 );
        brain_four_character_byte( string[10], 0, 0, value1 );
        break;
    case BC_FORMAT_G:
        brain_four_character_byte( string[6],  0, 0, value0 );
        brain_four_character_byte( string[10], 0, 1, 0 );
        break;
    default:
        brain_four_character_byte( string[6],  0, 1, 0 );
        brain_four_character_byte( string[10], 0, 0, value1 );
        break;
    }
    string[14] = 0;
}

function brain_sentence(string, response) {
var _tmp = 0;
var command      = response[0];
var value0       = response[1];
var value1       = response[2];
var instruction  = ( command & ( BRAINCODE_CONSTANT0_BIT - 1 ) ) % BRAINCODE_INSTRUCTIONS;
var format = brain_format( instruction, command, value0, value1 );
    var first_word, second_word;
var position     = 0;

    brain_longword( first_word, value0 );
    brain_longword( second_word, value1 );

    switch ( format )
    {
    case BC_FORMAT_A:
    case BC_FORMAT_C:
    case BC_FORMAT_E:
    case BC_FORMAT_F:
        io_string_write( string, braincode_spoken_dictionary[instruction], position );
        io_string_write( string, " ", position );
        io_string_write( string, first_word, position );
        io_string_write( string, second_word, position );
        break;
    case BC_FORMAT_G:
        io_string_write( string, braincode_spoken_dictionary[instruction], position );
        io_string_write( string, " ", position );
        io_string_write( string, first_word, position );
        break;
    default:
        io_string_write( string, braincode_spoken_dictionary[instruction], position );
        io_string_write( string, " ", position );
        io_string_write( string, second_word, position );
        break;
    }
}

function get_braincode_instruction_type(instruction_type) {
var _tmp = 0;
    var local_random = new Array(2);

    math_random3( local_random );
    switch ( instruction_type )
    {
    case 0: 
        return BRAINCODE_DATA_START + ( local_random[0] % ( BRAINCODE_DATA_NUMBER ) );
    case 1: 
        return BRAINCODE_SENSORS_START + ( local_random[0] % ( BRAINCODE_SENSORS_NUMBER ) );
    case 2: 
        return BRAINCODE_ACTUATORS_START + ( local_random[0] % ( BRAINCODE_ACTUATORS_NUMBER ) );
    case 3: 
        return BRAINCODE_OPERATORS_START + ( local_random[0] % ( BRAINCODE_OPERATORS_NUMBER ) );
    case 4: 
        return BRAINCODE_CONDITIONALS_START + ( local_random[0] % ( BRAINCODE_CONDITIONALS_NUMBER ) );
    }

    return BRAINCODE_DATA_START;
}

function get_braincode_instruction(local_being) {
var _tmp = 0;
    var prob = new Array(5), total, index;
var genetics = being_genetics( local_being );
    var i;
var min = 2;

    prob[0] = ( min + GENE_BRAINCODE_SENSORS( genetics ) );
    prob[1] = ( min + GENE_BRAINCODE_ACTUATORS( genetics ) );
    prob[2] = ( min + GENE_BRAINCODE_CONDITIONALS( genetics ) );
    prob[3] = ( min + GENE_BRAINCODE_OPERATORS( genetics ) );
    prob[4] = ( min + GENE_BRAINCODE_DATA( genetics ) );

    total = prob[0] + prob[1] + prob[2] + prob[3] + prob[4];

    if ( total == 0 )
    {
        index = 0;
    }
    else
    {
        index = being_random( local_being );
    }
    total = 0;
    for ( i = 0; i < 5; i++, total += prob[i] )
    {
        if ( index >= total )
        {
            return get_braincode_instruction_type( i );
        }
    }
    return get_braincode_instruction_type( 4 );
}

function get_actor_index(social_graph, value) {
var _tmp = 0;
    var i;

    for ( i = 0; i < SOCIAL_SIZE; i++ )
    {
        if ( SOCIAL_GRAPH_ENTRY_EMPTY( social_graph, i ) )
        {
            break;
        }
    }

    if ( i == 0 )
    {
        return 0;
    }

    return value % i;
}

function get_actor_index_from_episode(social_graph, episodic_event, episode_index) {
var _tmp = 0;
    var i, actor_index = -1;

    for ( i = 1; i < SOCIAL_SIZE_BEINGS; i++ )
    {
        if ( !SOCIAL_GRAPH_ENTRY_EMPTY( social_graph, i ) )
        {
            if ( social_graph[i].family_name == episodic_event[episode_index].family_name )
            {
                actor_index = i;
                if ( social_graph[i].first_name == episodic_event[episode_index].first_name )
                {
                    actor_index = i;
                    break;
                }
            }
        }
    }
    return actor_index;
}

function attention_similar(episode_index, episodic, memory_visited, carry_through, function_) {
var _tmp = 0;
    var i;
var visited_max = memory_visited[episode_index] - ( EPISODIC_SIZE >> 1 );
var min = -1;
var next_episode_index = -1;
    if ( visited_max < 0 )
    {
        visited_max = 0;
    }

    for ( i = 0; i < EPISODIC_SIZE; i++ )
    {
        if ( episodic[i].event == 0 )
        {
            continue;
        }

        if ( i != episode_index )
        {
            
            if ( memory_visited[i] <= visited_max )
            {
                
var diff = function_( episodic[i], carry_through );
                if ( diff < 0 )
                {
                    diff = -diff;
                }
                if ( ( min == -1 ) || ( diff < min ) )
                {
                    
                    min = diff;
                    next_episode_index = i;
                }
            }
        }
    }
    if ( next_episode_index > -1 )
    {
        
        memory_visited[next_episode_index] = memory_visited[episode_index] + 1;
    }
    return next_episode_index;
}

function similar_time(episodic, carry_through) {
var _tmp = 0;
var dt = episodic.space_time.time - carry_through[0];
    if ( dt < 0 )
    {
        dt = - dt;
    }
    return dt;
}

function attention_similar_time(episode_index, episodic, memory_visited) {
var _tmp = 0;
var time = episodic[episode_index].space_time.time;
    return attention_similar( episode_index, episodic, memory_visited, time, similar_time );
}

function similar_affect(episodic, carry_through) {
var _tmp = 0;
var da = episodic.affect - carry_through[0];
    if ( da < 0 )
    {
        da = - da;
    }
    return da;
}

function attention_similar_affect(episode_index, episodic, memory_visited) {
var _tmp = 0;
var affect = episodic[episode_index].affect;
    return attention_similar( episode_index, episodic, memory_visited, affect, similar_affect );
}

function similar_name(episodic, carry_through) {
var _tmp = 0;
var similarity = 3;
    var values = new Array(2);

    being_unpack_family( episodic.family_name[BEING_MET], values );

    if ( values[0] == carry_through[0] )
    {
        similarity--;
    }
    if ( values[1] == carry_through[1] )
    {
        similarity--;
    }
    if ( episodic.first_name[BEING_MET] == carry_through[2] )
    {
        similarity--;
    }
    return similarity;
}

function attention_similar_name(episode_index, episodic, meeter, memory_visited) {
var _tmp = 0;
    var name = new Array(3);
    var values = new Array(2);

    being_unpack_family( episodic.family_name[BEING_MET], values );

    name[0] = values[0];
    name[1] = values[1];
    name[2] = episodic[episode_index].first_name[BEING_MET];

    return attention_similar( episode_index, episodic, memory_visited, name, similar_name );
}

function similar_date(episodic, carry_through) {
var _tmp = 0;
var dd = episodic.space_time.date - carry_through[0];
    if ( dd < 0 )
    {
        dd = - dd;
    }
    return dd;
}

function attention_similar_date(episode_index, episodic, memory_visited) {
var _tmp = 0;
var time = episodic[episode_index].space_time.date;
    return attention_similar( episode_index, episodic, memory_visited, time, similar_date );
}

function similar_place(episodic, carry_through) {
var _tmp = 0;
var dx = episodic.space_time.location[0] - carry_through[0];
var dy = episodic.space_time.location[1] - carry_through[1];
    
var da = ( dx * dx ) + ( dy * dy );
    return da;
}

function attention_similar_place(episode_index, episodic, memory_visited) {
var _tmp = 0;
    var location = new Array(2);
    location[0] = episodic[episode_index].space_time.location[0];
    location[1] = episodic[episode_index].space_time.location[1];
    return attention_similar( episode_index, episodic, memory_visited, location, similar_place );
}

function math_general_allocation(bc0, bc1, i) {
var _tmp = 0;
    if ( BRAINCODE_ADDRESS( i ) < BRAINCODE_SIZE )
    {
        
        return bc0[BRAINCODE_ADDRESS( i )];
    }
    
    return bc1[BRAINCODE_ADDRESS( i ) - BRAINCODE_SIZE];
}

function math_general_execution(instruction, is_constant0, is_constant1, addr0, addr1, value0, i, is_const0, is_const1, pspace, bc0, bc1, braincode_min_loop) {
var _tmp = 0;
    
    switch ( instruction )
    {
    case BRAINCODE_AND:
        if ( is_constant0 )
        {
            addr0[0] &= addr1[0];
        }
        else
        {
            if ( ( addr0[0] > 127 ) && ( addr1[0] > 127 ) )
            {
                i += BRAINCODE_BYTES_PER_INSTRUCTION;
            }
        }
        break;
    
    case BRAINCODE_OR:
        if ( is_constant0 )
        {
            addr0[0] |= addr1[0];
        }
        else
        {
            if ( ( addr0[0] > 127 ) || ( addr1[0] > 127 ) )
            {
                i += BRAINCODE_BYTES_PER_INSTRUCTION;
            }
        }
        break;
    
    case BRAINCODE_MOV:
        if ( ( !is_constant0 ) && ( !is_constant1 ) )
        {
            addr1[0] = addr0[0];
        }
        else
        {
            addr1[0] = value0;
        }
        break;
    
    case BRAINCODE_MVB:
    {
        var ptr0, ptr1, n, instructions_to_copy, dat = 0;

        if ( !is_constant0 )
        {
            ptr0 = BRAINCODE_ADDRESS( i + ( addr0[0] * BRAINCODE_BYTES_PER_INSTRUCTION ) );
        }
        else
        {
            ptr0 = BRAINCODE_ADDRESS( i + ( value0 * BRAINCODE_BYTES_PER_INSTRUCTION ) );
        }

        ptr1 = BRAINCODE_ADDRESS( i + ( is_const0 * BRAINCODE_BYTES_PER_INSTRUCTION ) );

        instructions_to_copy = 1 + ( pspace[1] % BRAINCODE_BLOCK_COPY );

        while ( dat < instructions_to_copy )
        {
            if ( ptr0 < BRAINCODE_SIZE )
            {
                addr0 = bc0[ptr0];
            }
            else
            {
                addr0 = bc1[ptr0 - BRAINCODE_SIZE];
            }

            if ( ptr1 < BRAINCODE_SIZE )
            {
                addr1 = bc0[ptr1];
            }
            else
            {
                addr1 = bc1[ptr1 - BRAINCODE_SIZE];
            }

            for ( n = 0; n < BRAINCODE_BYTES_PER_INSTRUCTION; n++ )
            {
                addr1[n] = addr0[n];
            }
            dat++;
            ptr0 = BRAINCODE_ADDRESS( ptr0 + BRAINCODE_BYTES_PER_INSTRUCTION );
            ptr1 = BRAINCODE_ADDRESS( ptr1 + BRAINCODE_BYTES_PER_INSTRUCTION );
        }
    }
    break;

    
    case BRAINCODE_ADD:
        if ( ( !is_constant0 ) && ( !is_constant1 ) )
        {
            addr1[0] += addr0[0];
        }
        else
        {
            addr1[0] += value0;
        }
        break;
    
    case BRAINCODE_SUB:
        if ( ( !is_constant0 ) && ( !is_constant1 ) )
        {
            addr1[0] -= addr0[0];
        }
        else
        {
            addr1[0] -= value0;
        }
        break;
    
    case BRAINCODE_MUL:
        if ( ( !is_constant0 ) && ( !is_constant1 ) )
        {
            addr1[0] *= addr0[0];
        }
        else
        {
            addr1[0] *= value0;
        }
        break;
    
    case BRAINCODE_DIV:
        if ( ( !is_constant0 ) && ( !is_constant1 ) )
        {
            addr1[0] >>= ( addr0[0] % 4 );
        }
        else
        {
            addr1[0] >>= ( value0 % 4 );
        }
        break;
    
    case BRAINCODE_MOD:
        if ( ( !is_constant0 ) && ( !is_constant1 ) )
        {
            if ( addr0[0] != 0 )
            {
                addr1[0] %= addr0[0];
            }
        }
        else
        {
            if ( value0 != 0 )
            {
                addr1[0] %= value0;
            }
        }
        break;
    
    case BRAINCODE_CTR:
        if ( addr0[0] > 127 )
        {
            if ( addr1[0] < 255 )
            {
                addr1[0]++;
            }
            else
            {
                addr1[0] = 0;
            }
        }
        else
        {
            if ( addr1[0] > 0 )
            {
                addr1[0]--;
            }
            else
            {
                addr1[0] = 255;
            }
        }
        break;
    
    case BRAINCODE_JMP:
    {
var v0 = is_const0;
var v1 = is_const1;
var i2 = ( i + ( ( ( v0 * 256 ) + v1 ) * BRAINCODE_BYTES_PER_INSTRUCTION ) ) % BRAINCODE_SIZE;
        if ( i2 <= i )
        {
            if ( ( i - i2 ) < braincode_min_loop )
            {
                i2 = i - braincode_min_loop;
                if ( i2 < 0 )
                {
                    i2 += BRAINCODE_SIZE;
                }
            }
        }
i = i2 - BRAINCODE_BYTES_PER_INSTRUCTION;
        break;
    }
    
    case BRAINCODE_JMZ:
    {
var v0 = is_const0;

        if ( v0 == 0 )
        {
var i2 = ( i + (  is_const1 * BRAINCODE_BYTES_PER_INSTRUCTION ) ) % BRAINCODE_SIZE;

            if ( i2 <= i )
            {
                if ( ( i - i2 ) < braincode_min_loop )
                {
                    i2 = i - braincode_min_loop;
                    if ( i2 < 0 )
                    {
                        i2 += BRAINCODE_SIZE;
                    }
                }
            }
i = i2 - BRAINCODE_BYTES_PER_INSTRUCTION;
        }
        break;
    }
    
    case BRAINCODE_JMN:
    {
var v0 = is_const0;
        if ( v0 != 0 )
        {
var i2 = ( i + (  is_const1 * BRAINCODE_BYTES_PER_INSTRUCTION ) ) % BRAINCODE_SIZE;
            if ( i2 <= i )
            {
                if ( ( i - i2 ) < braincode_min_loop )
                {
                    i2 = i - braincode_min_loop;
                    if ( i2 < 0 )
                    {
                        i2 += BRAINCODE_SIZE;
                    }
                }
            }
i = i2 - BRAINCODE_BYTES_PER_INSTRUCTION;
        }
        break;
    }
    
    case BRAINCODE_DJN:
        if ( addr0[0] - 1 != 0 )
        {
var i2 = ( i + (  is_const1 * BRAINCODE_BYTES_PER_INSTRUCTION ) ) % BRAINCODE_SIZE;
            addr0[0]--;

            if ( i2 <= i )
            {
                if ( ( i - i2 ) < braincode_min_loop )
                {
                    i2 = i - braincode_min_loop;
                    if ( i2 < 0 )
                    {
                        i2 += BRAINCODE_SIZE;
                    }
                }
            }
i = i2 - BRAINCODE_BYTES_PER_INSTRUCTION;
        }
        break;
    
    case BRAINCODE_SEQ:
        if ( ( !is_constant0 ) && ( !is_constant1 ) )
        {
            if ( addr1[0] == addr0[0] )
            {
                i = ( i + ( BRAINCODE_BYTES_PER_INSTRUCTION * ( 1 + pspace[0] ) ) ) % BRAINCODE_SIZE;
            }
        }
        else
        {
            if ( addr1[0] == value0 )
            {
                i = ( i + ( BRAINCODE_BYTES_PER_INSTRUCTION * ( 1 + pspace[0] ) ) ) % BRAINCODE_SIZE;
            }
        }
        break;
    
    case BRAINCODE_SNE:
        if ( ( !is_constant0 ) && ( !is_constant1 ) )
        {
            if ( addr1[0] != addr0[0] )
            {
                i = ( i + ( BRAINCODE_BYTES_PER_INSTRUCTION * ( 1 + pspace[0] ) ) ) % BRAINCODE_SIZE;
            }
        }
        else
        {
            if ( addr1[0] != value0 )
            {
                i = ( i + ( BRAINCODE_BYTES_PER_INSTRUCTION * ( 1 + pspace[0] ) ) ) % BRAINCODE_SIZE;
            }
        }
        break;
    
    case BRAINCODE_SLT:
        if ( ( !is_constant0 ) && ( !is_constant1 ) )
        {
            if ( addr1[0] < addr0[0] )
            {
                i = ( i + ( BRAINCODE_BYTES_PER_INSTRUCTION * ( 1 + pspace[0] ) ) ) % BRAINCODE_SIZE;
            }
        }
        else
        {
            if ( addr1[0] < value0 )
            {
                i = ( i + ( BRAINCODE_BYTES_PER_INSTRUCTION * ( 1 + pspace[0] ) ) ) % BRAINCODE_SIZE;
            }
        }
        break;
    
    case BRAINCODE_DAT0:
    case BRAINCODE_DAT1:
        break;
    
    case BRAINCODE_SWP:
    {
var tmp = addr0[0];
        addr0[0] = addr1[0];
        addr1[0] = tmp;
        break;
    }
    
    case BRAINCODE_INV:
        if ( is_constant0 )
        {
            addr0[0] = 255 - addr0[0];
        }
        else
        {
            addr1[0] = 255 - addr1[0];
        }
        break;
    
    case BRAINCODE_STP:
    {
var v0 = is_const0;
var v1 = is_const1;
        pspace[v0 % BRAINCODE_PSPACE_REGISTERS] = v1;
        break;
    }
    
    case BRAINCODE_LTP:
    {
var v0 = is_const0;
        addr1[0] = pspace[v0 % BRAINCODE_PSPACE_REGISTERS];
        break;
    }
    }
}

function brain_first_sense(group, meeter_being, met_being, meeter_social_graph, actor_index, switcher) {
var _tmp = 0;
    switch ( switcher % 32 )
    {
    case 0:
        return being_honor( meeter_being );
    case 1:
        return being_honor( met_being );
    case 2:
        return being_parasites( meeter_being );
    case 3:
        return being_parasites( met_being );
    case 4:
        return being_crowding( meeter_being );
    case 5:
        return being_family_first_name( meeter_being );
    case 6:
        return being_family_second_name( meeter_being );
    case 7:
        return being_family_first_name( met_being );
    case 8:
        return being_family_second_name( met_being );
    case 9:
        return being_facing( meeter_being );
    case 10:
        return being_facing( met_being );
    case 11:
        return being_speed( meeter_being );
    case 12:
        return meeter_social_graph[actor_index].familiarity & 255;
    case 13:
        return meeter_social_graph[actor_index].friend_foe;
    case 14:
        return meeter_social_graph[actor_index].attraction;
    

    
    
    case 17:
        return ( being_state( meeter_being ) & 255 );
    
    case 18:
        return ( ( being_state( meeter_being ) >> 8 ) & 255 );
    
    case 19:
        return being_drive( meeter_being, DRIVE_HUNGER );
    case 20:
        return being_drive( meeter_being, DRIVE_SOCIAL );
    case 21:
        return being_drive( meeter_being, DRIVE_FATIGUE );
    case 22:
        return being_drive( meeter_being, DRIVE_SEX );

    
    case 23:
        if ( FIND_SEX( GET_I( meeter_being ) ) == FIND_SEX( GET_I( met_being ) ) )
        {
            return 0;
        }
        else
        {
            return 255;
        }
        break;
    case 24:
        if ( FIND_SEX( GET_I( met_being ) ) == SEX_FEMALE )
        {
            return 255;
        }
        else
        {
            return 0;
        }
        break;
    case 25:
        if ( FIND_SEX( GET_I( met_being ) ) != SEX_FEMALE )
        {
            return 255;
        }
        else
        {
            return 0;
        }
    
    case 26:
    {
var v = 0;
        var n;
        for ( n = 0; n < INVENTORY_SIZE; n++ )
        {
            if ( met_being.changes.inventory[n] & INVENTORY_GROOMED )
            {
                v++;
            }
        }
        return  ( v << 4 );
    }
    case 27:
    {
var v = 0;
        var n;
        for ( n = 0; n < INVENTORY_SIZE; n++ )
        {
            if ( meeter_being.changes.inventory[n] & INVENTORY_GROOMED )
            {
                v++;
            }
        }
        return  ( v << 4 );
    }

    
    case 28:
    {
var v = 0;
        var n;
        for ( n = 0; n < INVENTORY_SIZE; n++ )
        {
            if ( met_being.changes.inventory[n] & INVENTORY_WOUND )
            {
                v++;
            }
        }
        return  ( v << 4 );
    }
    case 29:
    {
var v = 0;
        var n;
        for ( n = 0; n < INVENTORY_SIZE; n++ )
        {
            if ( meeter_being.changes.inventory[n] & INVENTORY_WOUND )
            {
                v++;
            }
        }
        return  ( v << 4 );
    }

    
    case 30:
        return being_posture( meeter_being );
    }
    
    return being_posture( met_being );
}

function territory_familiarity(local_being, index) {
var _tmp = 0;
var result = 0;

var familiarity = ( local_being.events.territory[index].familiarity );
    var i, max_familiarity = 1;

    
    for ( i = 0; i < TERRITORY_AREA; i++ )
    {
        if ( local_being.events.territory[i].familiarity > max_familiarity )
        {
            max_familiarity = local_being.events.territory[i].familiarity;
        }
    }

    if ( max_familiarity == 0 )
    {
        return 0;
    }

    result = ( familiarity * 255 / max_familiarity );

    return result;
}

function being_second_sense(group, addr00, local_addr10, meeter_being, met_being, actor_index, is_const1, episode_index, episodic) {
var _tmp = 0;
var new_episode_index = -1;
var switcher = addr00 % 25;

    var location = vect2_new();

var meeter_social_graph = being_social( meeter_being );
var territory_index = ( being_attention( meeter_being, ATTENTION_TERRITORY ) );
    var memory_visited = new Array(EPISODIC_SIZE);
    var i;
var relationship_index = ( being_attention( meeter_being, ATTENTION_RELATIONSHIP ) );


    being_space( meeter_being, location );
    spacetime_convert_to_map( location );

    
    for ( i = 0; i < EPISODIC_SIZE; i++ )
    {
        memory_visited[i] = 0;
    }
    switch ( switcher )
    {
    
    case 0:
        actor_index = get_actor_index( meeter_social_graph, is_const1 % SOCIAL_SIZE );
        
        being_set_attention( meeter_being, ATTENTION_ACTOR, actor_index );
        break;
    
    case 1:
        new_episode_index = is_const1 % EPISODIC_SIZE;
        break;
    
    case 2:
        territory_index = is_const1;
        being_set_attention( meeter_being, ATTENTION_TERRITORY, territory_index );
        break;
    
    case 3:
        being_set_attention( meeter_being, ATTENTION_BODY, is_const1 % INVENTORY_SIZE );
        break;
    case 4: 
        new_episode_index = attention_similar_place( episode_index, episodic, memory_visited );
        break;
    case 5: 
        new_episode_index = attention_similar_time( episode_index, episodic, memory_visited );
        break;
    case 6: 
        new_episode_index = attention_similar_date( episode_index, episodic, memory_visited );
        break;
    case 7: 
        new_episode_index = attention_similar_name( episode_index, episodic, meeter_being, memory_visited );
        break;
    case 8: 
        new_episode_index = attention_similar_affect( episode_index, episodic, memory_visited );
        break;
    case 9:
        local_addr10 = episodic[episode_index].event;
        break;
    case 10:
        local_addr10 = episodic[episode_index].food;
        break;
    case 11:
        local_addr10 = episodic[episode_index].affect & 255;
        break;
    case 12:
        local_addr10 = episodic[episode_index].arg & 255;
        break;
    case 13:
        local_addr10 = ( episodic[episode_index].space_time.location[0] * 255 / land_map_dimension() );
        break;
    case 14:
        local_addr10 = ( episodic[episode_index].space_time.location[1] * 255 / land_map_dimension() );
        break;
    case 15:
    {
        
var pressure = weather_pressure( POSITIVE_LAND_COORD( location.x ), POSITIVE_LAND_COORD( location.y ) );

        if ( pressure > 100000 )
        {
            pressure = 100000;
        }
        if ( pressure < 0 )
        {
            pressure = 0;
        }
local_addr10 = ( pressure >> 9 );
        break;
    }
    case 16:
    {
        
        var wind = vect2_new();
        weather_wind_vector( location, wind );
        if ( wind.x < 0 )
        {
            wind.x = -wind.x;
        }
        if ( wind.y < 0 )
        {
            wind.y = -wind.y;
        }
local_addr10 = ( ( wind.x + wind.y ) >> 7 );
        break;
    }
    case 17:
        local_addr10 = ( land_time() >> 3 );
        break;
    case 18:
        
        local_addr10 = being_attention( meeter_being, ATTENTION_BODY ) * 30;
        break;
    case 19:

        
        local_addr10 = meeter_being.events.territory[territory_index].name;

        break;
    case 20:
        
        local_addr10 = territory_familiarity( meeter_being, territory_index );
        break;
    case 21:
        
        local_addr10 = territory_familiarity( met_being, territory_index );
        break;
    case 22:
    {
        
var carrying = being_carried( meeter_being, BODY_RIGHT_HAND );
var obj_type = 0;

        if ( carrying == 0 )
        {
            carrying = being_carried( meeter_being, BODY_LEFT_HAND );
        }
        if ( carrying != 0 )
        {
            
            switch ( addr00 % 12 )
            {
            case 0:
                obj_type = INVENTORY_BRANCH;
                break;
            case 1:
                obj_type = INVENTORY_TWIG;
                break;
            case 2:
                obj_type = INVENTORY_ROCK;
                break;
            case 3:
                obj_type = INVENTORY_SHELL;
                break;
            case 4:
                obj_type = INVENTORY_GRASS;
                break;
            case 5:
                obj_type = INVENTORY_NUT;
                break;
            case 6:
                obj_type = INVENTORY_NUT_CRACKED;
                break;
            case 7:
                obj_type = INVENTORY_SCRAPER;
                break;
            case 8:
                obj_type = INVENTORY_SPEAR;
                break;
            case 9:
                obj_type = INVENTORY_FISH;
                break;
            case 10:
                obj_type = INVENTORY_BIRD_EGGS;
                break;
            case 11:
                obj_type = INVENTORY_LIZARD_EGGS;
                break;
            }
            if ( carrying & obj_type )
            {
                local_addr10 = 255;
            }
            else
            {
                local_addr10 = 0;
            }
        }

        break;
    }
    case 23:
    {
        
var idx = social_get_relationship( meeter_being, relationship_index );
        if ( idx > -1 )
        {
            actor_index = idx;
            
            being_set_attention( meeter_being, ATTENTION_ACTOR, actor_index );
        }
        break;
    }
    case 24:
    {
        
        relationship_index = 1 + ( local_addr10 % ( OTHER_MOTHER - 1 ) );
        
        being_set_attention( meeter_being, ATTENTION_RELATIONSHIP, relationship_index );
        break;
    }
    }

    
    if ( new_episode_index > -1 )
    {
        var possible_actor_index;
        episode_index = new_episode_index;
        being_set_attention( meeter_being, ATTENTION_EPISODE, episode_index );
        
        possible_actor_index = get_actor_index_from_episode( meeter_social_graph, episodic, episode_index );
        if ( possible_actor_index > -1 )
        {
            actor_index = possible_actor_index;
            
            being_set_attention( meeter_being, ATTENTION_ACTOR, actor_index );
        }
        
        being_set_attention( meeter_being, ATTENTION_TERRITORY,
                             ( APESPACE_TO_TERRITORY( episodic[episode_index].space_time.location[1] ) * 16 ) +
                             APESPACE_TO_TERRITORY( episodic[episode_index].space_time.location[0] ) );
    }
}

function brain_third_sense(group, meeter_being, met_being, internal, switcher, additional_write) {
var _tmp = 0;
var half_switcher = switcher >> 1;
var important_being = ( ( switcher & 1 ) ? met_being : meeter_being );
var genetics = being_genetics( important_being );
    switch ( half_switcher % 10 )
    {
    
    case 0:
        return ( GENE_EYE_SHAPE( genetics ) << 4 );
    case 1:
        return ( GENE_EYE_COLOR( genetics ) << 4 );
    case 2:
        return ( GENE_EYE_SEPARATION( genetics ) << 4 );
    case 3:
        return ( GENE_NOSE_SHAPE( genetics ) << 4 );
    case 4:
        return ( GENE_EAR_SHAPE( genetics ) << 4 );
    case 5:
        return ( GENE_EYEBROW_SHAPE( genetics ) << 4 );
    case 6:
        return ( GENE_MOUTH_SHAPE( genetics ) << 4 );
    case 7:
    {
var return_value = 0;

        var n;
var immune = ( important_being.immune_system );
        return_value = immune.antigens[0];
        for ( n = 1; n < IMMUNE_ANTIGENS; n++ )
        {
            if ( immune.antigens[n] > return_value )
            {
                return_value = immune.antigens[n];
            }
        }

        return return_value;
    }
    
    case 9: 
        if ( ( internal != 0 ) &&
                ( !( being_state( meeter_being )&BEING_STATE_SHOUTING ) ) &&
                ( !( being_state( meeter_being )&BEING_STATE_SPEAKING ) ) &&
                ( meeter_being.changes.shout[SHOUT_HEARD] > 0 ) )
        {
            return meeter_being.changes.shout[SHOUT_HEARD];
        }
        break;
        break;
    
    default:
        if ( switcher == 16 ) 
        {
var positive = being_affect( meeter_being, 1 ) >> 7;
            if ( positive > 255 )
            {
                positive = 255;
            }
            return positive;

        }
        {
            

var negative = being_affect( meeter_being, 0 ) >> 1;
            if ( negative > 255 )
            {
                negative = 255;
            }
            return negative;
        }
    }
    return additional_write[0]; 
}

function brain_first_action(group, awake, local_addr00, local_addr10, meeter_being, met_being, episode_index, episodic, pspace0, actor_index, meeter_social_graph, is_const1) {
var _tmp = 0;
    switch ( local_addr00 % 6 )
    {
    
    case 0:
        if ( ( awake != 0 ) && ( local_addr00 > 127 ) )
        {
            if ( meeter_being == met_being )
            {
                social_action( meeter_being, 0, local_addr10 );
            }
            else
            {
                social_action( meeter_being, met_being, local_addr10 );
            }
local_addr00 = 0;
        }
        break;
    
    case 1:
        if ( !( meeter_being.braindata.script_overrides & OVERRIDE_GOAL ) )
        {
            being_set_goal_location( meeter_being,
                                     episodic[episode_index].space_time.location[0],
                                     episodic[episode_index].space_time.location[1] );
        }
        break;
    
    case 2:
    {
var fof0 = pspace0;
var fof1 = local_addr10;

        if ( fof0 > ( fof1 + 85 ) )
        {
            if ( meeter_social_graph[actor_index].friend_foe < 170 )
            {
                meeter_social_graph[actor_index].friend_foe++;
            }
        }
        if ( fof1 > ( fof0 + 85 ) )
        {
            if ( meeter_social_graph[actor_index].friend_foe > 85 )
            {
                meeter_social_graph[actor_index].friend_foe--;
            }
        }
        break;
    }
    
    case 3:
    {
var att0 = local_addr10;
var att1 = pspace0;

        if ( att0 > ( att1 + 85 ) )
        {
            if ( meeter_social_graph[actor_index].attraction < 255 )
            {
                meeter_social_graph[actor_index].attraction++;
            }
        }
        if ( att1 > ( att0 + 85 ) )
        {
            if ( meeter_social_graph[actor_index].attraction > 16 )
            {
                meeter_social_graph[actor_index].attraction--;
            }
        }
        break;
    }
    
    case 4:
        
        if ( ( local_addr10 > 100 ) && ( local_addr10 < 150 ) )
        {
            if ( meeter_social_graph[actor_index].familiarity < 65535 )
            {
                meeter_social_graph[actor_index].familiarity++;
local_addr10 = 0;
            }
        }
        if ( ( local_addr10 > 150 ) && ( local_addr10 < 200 ) )
        {
            if ( meeter_social_graph[actor_index].familiarity > 10 )
            {
                meeter_social_graph[actor_index].familiarity--;
local_addr10 = 0;
            }
        }
        break;
    
    case 5:
    {
var n = pspace0 % BRAINCODE_PROBES;
var f = 1 + ( is_const1 % BRAINCODE_MAX_FREQUENCY );

        meeter_being.braindata.brainprobe[n].frequency = f;
        break;
    }
    }
}

function brain_dialogue(group, awake, meeter_being, met_being, bc0, bc1, being_index) {
var _tmp = 0;

var internal = ( meeter_being == met_being );
var braincode_min_loop = 8 * BRAINCODE_BYTES_PER_INSTRUCTION;
var i = 0, itt = 0;
    var actor_index;
var episode_index = ( being_attention( meeter_being, ATTENTION_EPISODE ) );
var anecdote_episode_index = -1;
var intention_episode_index = -1;

var meeter_social_graph = being_social( meeter_being );
var episodic = being_episodic( meeter_being );
    var max_itterations;
var pspace = meeter_being.braindata.braincode_register;

    
    if ( being_index > -1 )
    {
        actor_index = being_index;
    }
    else
    {
        being_index = being_attention( meeter_being, ATTENTION_ACTOR );
        actor_index = being_index;
    }

    if ( meeter_being == met_being )
    {
        
        max_itterations = BRAINCODE_MAX_ADDRESS / BRAINCODE_BYTES_PER_INSTRUCTION;
    }
    else
    {
        
        max_itterations = 8 + meeter_being.changes.learned_preference[PREFERENCE_CHAT];
    }

    i = 0;

    while ( itt < max_itterations )
    {
var instruction = BRAINCODE_INSTRUCTION( bc0, i );
var is_constant0 = BRAINCODE_CONSTANT0( bc0, i );
var is_constant1 = BRAINCODE_CONSTANT1( bc0, i );
var value0 = BRAINCODE_VALUE( bc0, i, 0 );
var value1 = BRAINCODE_VALUE( bc0, i, 1 );
var addr0 = math_general_allocation( bc0, bc1, i + value0 );
var addr1 = math_general_allocation( bc0, bc1, i + value1 );

        switch ( instruction )
        {
        
        case BRAINCODE_SEN:
        {
            addr1[0] = brain_first_sense( group, meeter_being, met_being, meeter_social_graph, actor_index, addr0[0] );
            break;
        }
        case BRAINCODE_SEN2:
        {
            being_second_sense( group, addr0[0], addr1[0], meeter_being, met_being, actor_index, IS_CONST1, episode_index, episodic );
            break;
        }
        case BRAINCODE_SEN3:

            addr1[0] = brain_third_sense( group, meeter_being, met_being, internal, addr0[0], addr1 );
            break;
        
        case BRAINCODE_ACT:
        {

            brain_first_action( group, awake, addr0[0], addr1[0], meeter_being, met_being, episode_index,
                                episodic, pspace[0], actor_index, meeter_social_graph, IS_CONST1 );
            break;
        }
        case BRAINCODE_ACT2:
        {
            switch ( addr0[0] % 6 )
            {
            case 0: 
            {
var n = pspace[0] % BRAINCODE_PROBES;
var typ = IS_CONST1 & 1;

                meeter_being.braindata.brainprobe[n].type = typ;
                break;
            }
            case 1: 
            {
var n = pspace[0] % BRAINCODE_PROBES;
var adr = IS_CONST1;

                meeter_being.braindata.brainprobe[n].address = adr;
                break;
            }
            case 2: 
            {
var msg = addr1[0];
                if ( is_constant1 )
                {
                    msg = value1;
                }
                if ( ( internal != 0 ) && ( awake != 0 ) &&
                        ( !( being_state( meeter_being )&BEING_STATE_SHOUTING ) ) &&
                        ( !( being_state( meeter_being )&BEING_STATE_SPEAKING ) ) &&
                        ( meeter_being.changes.shout[SHOUT_CONTENT] == 0 ) &&
                        ( meeter_being.changes.shout[SHOUT_HEARD] == 0 ) &&
                        ( meeter_being.changes.shout[SHOUT_CTR] == 0 ) &&
                        ( msg > 0 ) )
                {
                    meeter_being.changes.shout[SHOUT_CTR] = SHOUT_REFRACTORY;
                    being_add_state( meeter_being, BEING_STATE_SHOUTING );
                    
                    meeter_being.changes.shout[SHOUT_VOLUME] = pspace[0];
                    
                    meeter_being.changes.shout[SHOUT_CONTENT] = msg;
                }
                break;
            }
            case 3: 
            {
                if ( intention_episode_index != episode_index )
                {
var v0 = pspace[0];
var v1 = IS_CONST1;
                    if ( episodic_intention( meeter_being, episode_index, ( v0 * 10 ), v1 ) != 0 )
                    {
                        intention_episode_index = episode_index;
                    }
                }
                break;
            }
            case 4: 
            {
var n = pspace[0] % BRAINCODE_PROBES;
var offset = IS_CONST1;

                meeter_being.braindata.brainprobe[n].offset = offset;
                break;
            }
            case 5: 
                if ( awake != 0 )
                {
                    being_set_posture( meeter_being, addr1[0] );
                }
                break;
            }
            break;
        }
        case BRAINCODE_ACT3:
            switch ( addr0[0] % 2 )
            {
            
            case 0:
            {
var n = pspace[0] % BRAINCODE_PROBES;
var p = IS_CONST1;
                meeter_being.braindata.brainprobe[n].position = p;
                break;
            }
            
            case 1:
            {
                var n;
var prf = addr1[0];

                n = pspace[0] % PREFERENCES;

                if ( ( prf > 55 ) && ( prf < 155 ) )
                {
                    if ( meeter_being.changes.learned_preference[n] < 255 )
                    {
                        meeter_being.changes.learned_preference[n]++;
                        addr1[0] = 0;
                    }
                }
                if ( prf >= 155 )
                {
                    if ( meeter_being.changes.learned_preference[n] > 0 )
                    {
                        meeter_being.changes.learned_preference[n]--;
                        addr1[0] = 0;
                    }
                }
                break;
            }
            break;
            }
        
        case BRAINCODE_ANE:
            if ( internal == 0 )
            {
                
                
                if ( anecdote_episode_index != episode_index )
                {
                    if ( episodic_anecdote( meeter_being, met_being ) != 0 )
                    {
                        anecdote_episode_index = episode_index;
                    }
                }
            }
            break;

        default:
            math_general_execution( instruction, is_constant0, is_constant1,
                                    addr0, addr1, value0, i,
                                    IS_CONST0, IS_CONST1,
                                    pspace,
                                    bc0, bc1,
                                    braincode_min_loop );
            break;


        }
        i += BRAINCODE_BYTES_PER_INSTRUCTION;
        itt++;

        if ( i >= BRAINCODE_SIZE )
        {
            i -= BRAINCODE_SIZE;
        }
    }

}
