
/****************************************************************

 spacetime.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }

function spacetime_to_string(value) {
var _tmp = 0;
    if ( !value )
    {
        value = new Array( STRING_BLOCK_SIZE );
    }
var minutes = land_time();
var days = land_date();
var military_time = ( minutes % 60 );
var hours = ( minutes / 60 );
var days_month = ( days % 28 ) + 1;
var month = ( ( days / 28 ) % 13 ) + 1;
var years = days / ( 28 * 13 );

    military_time += hours * 100;

    value[0] = '0' + ( military_time / 1000 ) % 10;
    value[1] = '0' + ( military_time / 100 ) % 10;
    value[2] = ':';
    value[3] = '0' + ( military_time / 10 ) % 10;
    value[4] = '0' + ( military_time / 1 ) % 10;
    value[5] = ' ';
    value[6] = '0' + ( days_month / 10 ) % 10;
    value[7] = '0' + ( days_month / 1 ) % 10;
    value[8] = '/';
    value[9] = '0' + ( month / 10 ) % 10;
    value[10] = '0' + ( month / 1 ) % 10;
    value[11] = '/';
    {
var year_string = "" + ( years );
var year_index = 0;
        while ( year_index < year_string.length )
        {
            value[12 + year_index] = year_string[year_index];
            year_index++;
        }
        value[12 + year_index] = 0;
    }
    return value;
}

function spacetime_after(initial, second) {
var _tmp = 0;
    if ( initial.date < second.date )
    {
        return 0;
    }
    if ( initial.date > second.date )
    {
        return 1;
    }
    if ( initial.time > second.time )
    {
        return 1;
    }
    return 0;
}

function spacetime_before_now(initial) {
var _tmp = 0;
    if ( initial.date > land_date() )
    {
        return 0;
    }
    if ( initial.date < land_date() )
    {
        return 1;
    }
    if ( initial.time < land_time() )
    {
        return 1;
    }
    return 0;
}

function spacetime_copy(to, from) {
var _tmp = 0;
    to.location[0] = from.location[0];
    to.location[1] = from.location[1];

    to.date = from.date;
    to.time = from.time;
}

function spacetime_set(set, location) {
var _tmp = 0;
    set.location[0] = location[0];
    set.location[1] = location[1];
    set.time        = land_time();
    set.date        = land_date();
}

function spacetime_convert_to_map(value) {
var _tmp = 0;
    if ( Array.isArray( value ) )
    {
        value[0] = APESPACE_TO_MAPSPACE( value[0] );
        value[1] = APESPACE_TO_MAPSPACE( value[1] );
        return value;
    }
    value.x = APESPACE_TO_MAPSPACE( value.x );
    value.y = APESPACE_TO_MAPSPACE( value.y );
    return value;
}
