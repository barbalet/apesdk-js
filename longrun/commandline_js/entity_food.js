
/****************************************************************

 food.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var GENE_ENERGY_FROM_VEGETABLES = (...args) => (null);
var GENE_ENERGY_FROM_FRUITS = (...args) => (null);
var GENE_ENERGY_FROM_SHELLFISH = (...args) => (null);
var GENE_ENERGY_FROM_SEAWEED = (...args) => (null);
var GENE_ENERGY_FROM_BIRD_EGGS = (...args) => (null);
var GENE_ENERGY_FROM_LIZARD_EGGS = (...args) => (null);

function food_absorption(local, max_energy, food_type) {
var _tmp = 0;
var genetics = being_genetics( local );

var vegetable = GENE_ENERGY_FROM_VEGETABLES( genetics );
var fruit = GENE_ENERGY_FROM_FRUITS( genetics );
var shellfish = GENE_ENERGY_FROM_SHELLFISH( genetics );
var seawood = GENE_ENERGY_FROM_SEAWEED( genetics );

var bird_eggs = GENE_ENERGY_FROM_BIRD_EGGS( genetics );
var lizard_eggs = GENE_ENERGY_FROM_LIZARD_EGGS( genetics );

var return_value = 0;
    
var absorb_denom = 1 + vegetable + fruit + seawood + bird_eggs + lizard_eggs;

    
    immune_ingest_pathogen( local.immune_system, food_type );

    switch ( food_type )
    {
    case FOOD_VEGETABLE:

    {
        var information_string;
        sprintf( information_string, "vegetable %ld absorbtion %ld food", vegetable, absorb_denom );
        being_register_movement( local, information_string );
    }

    return_value = ( vegetable << 4 ) / absorb_denom;
    break;
    case FOOD_FRUIT:

        being_register_movement( local, "fruit food" );

        return_value = ( fruit << 4 ) / absorb_denom;
        break;
    case FOOD_SHELLFISH:

        being_register_movement( local, "shellfish food" );

        return_value = ( shellfish << 4 ) / absorb_denom;
        break;
    case FOOD_SEAWEED:

        being_register_movement( local, "seaweed food" );

        return_value = ( seawood << 4 ) / absorb_denom;
        break;
    case FOOD_BIRD_EGGS:

        being_register_movement( local, "bird egg food" );

        return_value = ( seawood << 4 ) / absorb_denom;
        break;
    case FOOD_LIZARD_EGGS:

        being_register_movement( local, "lizard egg food" );

        return_value = ( seawood << 4 ) / absorb_denom;
        break;
    default:

        being_register_movement( local, "no food" );

        return 0;
    }

    return_value = ( max_energy * ( 1 + return_value ) >> 3 );

    if ( return_value > 320 )
    {
        return_value = 320; 
    }
    return return_value;
}

function food_location(loc_x, loc_y, kind) {
var _tmp = 0;
    return land_operator_interpolated( loc_x, loc_y,
                                       operators[kind - VARIABLE_BIOLOGY_AREA] );
}

function food_values(loc_x, loc_y, grass, trees, bush) {
var _tmp = 0;
grass =
        food_location( loc_x, loc_y, VARIABLE_BIOLOGY_GRASS ) + OFFSET_GRASS;
trees =
        food_location( loc_x, loc_y, VARIABLE_BIOLOGY_TREE );
bush =
        food_location( loc_x, loc_y, VARIABLE_BIOLOGY_BUSH ) + OFFSET_BUSH;
grass += LAND_DITHER( grass, trees, bush );
    return { grass: grass, trees: trees, bush: bush };
}

function food_eat_land(loc_x, loc_y, energy) {
var _tmp = 0;
var food_type = FOOD_VEGETABLE;
    var food = { grass: 0, trees: 0, bush: 0 };
    var grass, trees, bush;

    

    food = food_values( loc_x, loc_y, grass, trees, bush );
    grass = food.grass;
    trees = food.trees;
    bush = food.bush;

    
    if ( ( grass > bush ) && ( grass > trees ) )
    {
        energy = ENERGY_GRASS;
    }
    else
    {
        if ( bush > trees )
        {
            energy = ENERGY_BUSH;
        }
        else
        {
            energy = ENERGY_FRUIT;
            food_type = FOOD_FRUIT;
        }
    }
    return food_type;
}

function food_intertidal(loc_x, loc_y, energy) {
var _tmp = 0;
var food_type = FOOD_VEGETABLE;
    var seaweed, rockpool, beach;

    
    seaweed =
        food_location( loc_x, loc_y, VARIABLE_BIOLOGY_SEAWEED );

    
    rockpool =
        food_location( loc_x, loc_y, VARIABLE_BIOLOGY_ROCKPOOL );

    
    beach =
        food_location( loc_x, loc_y, VARIABLE_BIOLOGY_BEACH );

    beach += LAND_DITHER( seaweed, rockpool, beach );

    
    if ( ( seaweed > rockpool ) && ( seaweed > beach ) )
    {
        energy = ENERGY_SEAWEED;
        food_type = FOOD_SEAWEED;
    }
    else
    {
        if ( rockpool > beach )
        {
            energy = ENERGY_SHELLFISH;
            food_type = FOOD_SHELLFISH;
        }
    }
    return food_type;
}

function food_eat(loc_x, loc_y, az, food_type, local_being) {
var _tmp = 0;
var max_energy = BEING_DEAD;
food_type = FOOD_VEGETABLE;

    if ( az > TIDE_MAX )
    {
        
        food_type = food_eat_land( loc_x, loc_y, max_energy );
    }
    else
    {
        
        food_type = food_intertidal( loc_x, loc_y, max_energy );
    }

    return food_absorption( local_being, max_energy, food_type );
}
