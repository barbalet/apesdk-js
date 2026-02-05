
/****************************************************************

 immune.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var IMMUNE_FIT = 5;
var MIN_ANTIBODIES = 16;
var MIN_ANTIGENS = 8;
var PATHOGEN_TRANSMISSION_PROB = 1000;
var PATHOGEN_ENVIRONMENT_PROB = 100;
var PATHOGEN_MUTATION_PROB = 100;
var ANTIBODY_DEPLETION_PROB = 100;
var RANDOM_PATHOGEN = (...args) => (null);
var PATHOGEN_SEVERITY = (...args) => (null);
var PATHOGEN_TRANSMISSION = (...args) => (null);

function immune_init(immune, local_random) {
var _tmp = 0;

    var i;
    immune.random_seed[0] = local_random[0];
    immune.random_seed[1] = local_random[1];

    for ( i = 0; i < IMMUNE_ANTIGENS; i += 2 )
    {
        immune.antigens[i] = 0;
        immune.antigens[i + 1] = 0;
        math_random3( immune.random_seed );
        immune.shape_antigen[i] = ( immune.random_seed[0] & 255 );
        immune.shape_antigen[i + 1] = ( immune.random_seed[1] & 255 );
    }
    for ( i = 0; i < IMMUNE_POPULATION; i += 2 )
    {
        immune.antibodies[i] = 0;
        immune.antibodies[i + 1] = 0;
        math_random3( immune.random_seed );
        immune.shape_antibody[i] = ( immune.random_seed[0] & 255 );
        immune.shape_antibody[i + 1] = ( immune.random_seed[1] & 255 );
    }

}

function immune_seed(immune_mother, immune_child) {
var _tmp = 0;

    var i;
    
    for ( i = 0; i < IMMUNE_POPULATION; i++ )
    {
        immune_child.shape_antibody[i] = immune_mother.shape_antibody[i];
        immune_child.antibodies[i] = immune_mother.antibodies[i];
    }

}

function immune_acquire_pathogen(immune, transmission_type) {
var _tmp = 0;

    var i;
    math_random3( immune.random_seed );
    if ( immune.random_seed[0] < PATHOGEN_ENVIRONMENT_PROB )
    {
        i = immune.random_seed[1] % IMMUNE_ANTIGENS;
        if ( immune.antigens[i] == 0 )
        {
            math_random3( immune.random_seed );
            immune.antigens[i] = ( immune.random_seed[0] & 7 );
            immune.shape_antigen[i] = RANDOM_PATHOGEN( immune.random_seed[1], transmission_type );
        }
    }

}

function immune_ingest_pathogen(immune, food_type) {
var _tmp = 0;
var transmission_type = food_type + PATHOGEN_TRANSMISSION_FOOD_VEGETABLE;
    immune_acquire_pathogen( immune, transmission_type );
}

function immune_transmit(immune0, immune1, transmission_type) {
var _tmp = 0;

    var i, j;
    
    immune_acquire_pathogen( immune0, transmission_type );

    
    math_random3( immune0.random_seed );
    if ( immune0.random_seed[0] < PATHOGEN_TRANSMISSION_PROB )
    {
        math_random3( immune0.random_seed );
        i = immune0.random_seed[0] % IMMUNE_ANTIGENS;
        if ( ( immune0.antigens[i] > 0 ) &&
                ( PATHOGEN_TRANSMISSION( immune0.shape_antigen[i] ) == transmission_type ) )
        {
            
            for ( j = 0; j < IMMUNE_ANTIGENS; j++ )
            {
                if ( immune0.shape_antigen[i] == immune1.shape_antigen[j] )
                {
                    if ( immune1.antigens[j] < 255 )
                    {
                        immune1.antigens[j]++;
                    }
                    break;
                }
            }
            if ( j == IMMUNE_ANTIGENS )
            {
                j = immune0.random_seed[1] % IMMUNE_ANTIGENS;
                if ( immune1.antigens[j] <= MIN_ANTIGENS )
                {
                    
                    immune1.shape_antigen[j] = immune0.shape_antigen[i];
                }
            }
        }
    }

}

function immune_response(immune, honor_immune, being_energy) {
var _tmp = 0;

    var min_antibodies;
    var max_bits_matched;
    var total_antigens, max_severity;
    var i, j, k, match, best_match, bits_matched, bit;

    
    math_random3( immune.random_seed );
    if ( immune.random_seed[0] < ANTIBODY_DEPLETION_PROB )
    {
        i = immune.random_seed[1] % IMMUNE_POPULATION;
        if ( immune.antibodies[i] > 0 )
        {
            immune.antibodies[i]--;
        }
    }

    
    math_random3( immune.random_seed );
    i = immune.random_seed[0] % IMMUNE_ANTIGENS;
    if ( immune.antigens[i] != 0 )
    {
        
        if ( immune.random_seed[1] < PATHOGEN_MUTATION_PROB )
        {
            math_random3( immune.random_seed );
            if ( ( immune.shape_antigen[i] & ( 1 << ( immune.random_seed[0] & 7 ) ) ) != 0 )
            {
                immune.shape_antigen[i] ^= ( immune.random_seed[0] & 7 );
            }
            else
            {
                immune.shape_antigen[i] |= ( immune.random_seed[0] & 7 );
            }
        }

        
        max_bits_matched = 0;
        best_match = 0;
        for ( j = 0; j < IMMUNE_POPULATION; j++ )
        {
            match = ( immune.shape_antibody[j] & immune.shape_antigen[i] ) |
                    ( ( ~immune.shape_antibody[j] ) & ( ~immune.shape_antigen[i] ) );
            if ( match != 0 )
            {
                
                bits_matched = 0;
                for ( bit = 0; bit < 8; bit++ )
                {
                    if ( ( match & ( 1 << bit ) ) != 0 )
                    {
                        bits_matched++;
                    }
                }
                
                if ( bits_matched > max_bits_matched )
                {
                    max_bits_matched = bits_matched;
                    best_match = j;
                }
            }
        }

        
        min_antibodies = immune.antibodies[0];
        j = 0;
        for ( k = 1; k < IMMUNE_POPULATION; k++ )
        {
            if ( immune.antibodies[k] < min_antibodies )
            {
                min_antibodies = immune.antibodies[k];
                j = k;
            }
        }

        
        if ( max_bits_matched > IMMUNE_FIT )
        {
            
            if ( immune.antibodies[best_match] < 255 - max_bits_matched )
            {
                immune.antibodies[best_match] += max_bits_matched;
                
                if ( immune.antibodies[best_match] < MIN_ANTIBODIES )
                {
                    immune.antibodies[best_match] = MIN_ANTIBODIES;
                }
            }
            
            if ( immune.antigens[i] > honor_immune )
            {
                immune.antigens[i] -= honor_immune;
            }
            else
            {
                immune.antigens[i] = 0;
            }
            
            if ( j != best_match )
            {
                immune.antibodies[j] = 1;
                match = immune.shape_antibody[best_match];
                math_random3( immune.random_seed );
                if ( ( match & ( 1 << ( immune.random_seed[0] & 7 ) ) ) != 0 )
                {
                    match ^= ( immune.random_seed[0] & 7 );
                }
                else
                {
                    match |= ( immune.random_seed[0] & 7 );
                }
                immune.shape_antibody[j] = match;
            }
        }
        else
        {
            
            if ( immune.antigens[i] < 255 )
            {
                immune.antigens[i]++;
            }

            
            math_random3( immune.random_seed );
            if ( immune.random_seed[0] < being_energy )
            {
                math_random3( immune.random_seed );
                immune.shape_antibody[j] = ( immune.random_seed[0] & 255 );
                immune.antibodies[j] = ( immune.random_seed[1] & 7 );
            }
        }
    }

    
    total_antigens = 0;
    max_severity = 0;
    for ( i = 0; i < IMMUNE_ANTIGENS; i++ )
    {
        
        total_antigens += immune.antigens[i];
        
        if ( immune.shape_antigen[i] > max_severity )
        {
            max_severity = immune.shape_antigen[i];
        }
    }
    math_random3( immune.random_seed );
    if ( ( immune.random_seed[0] < ( total_antigens >> 2 ) ) && ( being_energy >= 1 ) )
    {
        return PATHOGEN_SEVERITY( max_severity );
    }

    return 0;
}