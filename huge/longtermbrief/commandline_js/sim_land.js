
/****************************************************************

 land.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var m_land;
var OPERATOR_AREA = (...args) => (null);
var OPERATOR_HEIGHT = (...args) => (null);
var OPERATOR_WATER = (...args) => (null);
var OPERATOR_SUN = (...args) => (null);
var OPERATOR_SALT = (...args) => (null);
var WATER_MAP2 = null;

function land_allocate() {
var _tmp = 0;
    if ( m_land )
    {
        return m_land;
    }
    var tile_count = ( typeof MAP_TILES !== "undefined" && MAP_TILES ) ? MAP_TILES : 1;
    var map_area = ( typeof MAP_AREA !== "undefined" && MAP_AREA ) ? MAP_AREA : 0;
    var hi_area = ( typeof HI_RES_MAP_AREA !== "undefined" && HI_RES_MAP_AREA ) ? HI_RES_MAP_AREA : 0;
    var tiles = new Array( tile_count );
    var tile_index = 0;
    while ( tile_index < tile_count )
    {
        tiles[tile_index] = {
            genetics: [0, 0],
            topography: [ new Uint8Array( map_area ), new Uint8Array( map_area ) ],
            atmosphere: [ new Int32Array( map_area ), new Int32Array( map_area ) ],
            delta_pressure: new Uint16Array( map_area ),
            delta_pressure_highest: 0,
            delta_pressure_lowest: 0,
            atmosphere_highest: 0,
            atmosphere_lowest: 0,
            local_delta: 0
        };
        tile_index++;
    }
    m_land = {
        tiles: tiles,
        genetics: [0, 0],
        wind_value_x: 0,
        wind_value_y: 0,
        wind_aim_x: 0,
        wind_aim_y: 0,
        wind_dissipation: 0,
        date: 0,
        time: 0,
        tide_level: 0,
        topography_highdef: new Uint8Array( hi_area * 2 ),
        highres_tide: new Uint32Array( hi_area / 32 )
    };
    return m_land;
}

m_land = land_allocate();

function land_topography_highdef() {
var _tmp = 0;
    return m_land.topography_highdef;
}

function land_date() {
var _tmp = 0;
    return m_land.date;
}

function land_time() {
var _tmp = 0;
    return m_land.time;
}

function land_tide_level() {
var _tmp = 0;
    return m_land.tide_level;
}

function land_highres_tide() {
var _tmp = 0;
    return m_land.highres_tide;
}

function land_cycle() {
var _tmp = 0;
    m_land.time++;
    if ( m_land.time == TIME_DAY_MINUTES )
    {
        m_land.time = 0;
        m_land.date++;
    }

    land_tide();
}

function math_bilinear_8_times(side512, data, double_spread) {
var _tmp = 0;
var loop_y = 0;

    NA_ASSERT( side512, "side512 null" );
    NA_ASSERT( data, "data null" );

    if ( side512 == 0 )
    {
        return;
    }
    if ( data == 0 )
    {
        return;
    }

    while ( loop_y < HI_RES_MAP_DIMENSION )
    {
var loop_x = 0;
        while ( loop_x < HI_RES_MAP_DIMENSION )
        {
            
var mic_x = ( loop_x & 7 );
            
var mic_y = ( loop_y & 7 );

var mac_x = ( loop_x >> 3 );
var mac_y = ( loop_y >> 3 );

var px0 = ( mac_x );
var py0 = ( mac_y * MAP_DIMENSION );

var px1 = ( mac_x + 1 ) & ( MAP_DIMENSION - 1 );
var py1 = ( ( mac_y + 1 ) & ( MAP_DIMENSION - 1 ) ) * MAP_DIMENSION;

var z00 = side512[px0 | py0];

var z01 = side512[px1 | py0];
var z10 = side512[px0 | py1] - z00;
var z11 = side512[px1 | py1] - z01 - z10;
var point = ( loop_x + ( loop_y * HI_RES_MAP_DIMENSION ) );
            var value;

            z01 = ( z01 - z00 ) << 3;
            z10 = z10 << 3;

            value = ( ( z00 + ( ( ( z01 * mic_x ) + ( z10 * mic_y ) + ( z11 * mic_x * mic_y ) ) >> 6 ) ) );
            if ( double_spread )
            {
                data[( point << 1 ) | 1] = data[point << 1] = value;
            }
            else
            {
                data[point] = value;
            }
            loop_x++;
        }
        loop_y++;
    }
}

function land_operator(locx, locy, specific_kind) {
var _tmp = 0;
var temp = 0, temp_add;
var number_sum = 0;

    var fg;
    var dfg;
    var fdg;

    NA_ASSERT( specific_kind, "specific_kind null" );

    fg  = land_location( locx, locy );
    dfg = land_location( locx + 1, locy );
    fdg = land_location( locx, locy + 1 );

    dfg = ( dfg - fg ) * 8;
    fdg = ( fdg - fg ) * 8;

    fg = fg - WATER_MAP;

    if ( specific_kind[0] != '.' )
    {
        number_sum ++;
        temp_add = OPERATOR_AREA( fg, dfg, fdg ); 
        if ( specific_kind[0] == '+' )
        {
            temp += temp_add;
        }
        else
        {
            temp += WATER_MAP2 - temp_add;
        }
    }
    if ( specific_kind[1] != '.' )
    {
        number_sum ++;
        temp_add = OPERATOR_HEIGHT( fg, dfg, fdg ); 
        if ( specific_kind[1] == '+' )
        {
            temp += temp_add;
        }
        else
        {
            temp += WATER_MAP2 - temp_add;
        }
    }
    if ( specific_kind[2] != '.' )
    {
        number_sum ++;
        temp_add = OPERATOR_WATER( fg, dfg, fdg ); 
        if ( specific_kind[2] == '+' )
        {
            temp += temp_add;
        }
        else
        {
            temp += WATER_MAP2 - temp_add;
        }
    }
    if ( specific_kind[3] != '.' )
    {
        if ( IS_NIGHT( m_land.time ) == 0 )
        {
            
var hr = ( ( ( ( m_land.time << 6 ) / 180 ) + 32 ) & 255 );

var weather = weather_seven_values( MAPSPACE_TO_APESPACE( locx ), MAPSPACE_TO_APESPACE( locy ) );

var weather_divide = ( 105 + ( ( weather % 3 ) * 30 ) );
            var time_weather = vect2_new();

            vect2_direction( time_weather, hr, weather_divide * 32 );
            vect2_offset( time_weather, 840 / weather_divide, 840 / weather_divide );

            number_sum ++;
            temp_add = OPERATOR_SUN( fg, dfg, fdg, time_weather.x, time_weather.y ); 
            if ( specific_kind[3] == '+' )
            {
                temp += temp_add;
            }
            else
            {
                temp += WATER_MAP2 - temp_add;
            }
        }
    }
    if ( specific_kind[4] != '.' )
    {
        number_sum ++;
        temp_add = OPERATOR_SUN( fg, dfg, fdg, 11, 11 ); 
        if ( specific_kind[4] == '+' )
        {
            temp += temp_add;
        }
        else
        {
            temp += WATER_MAP2 - temp_add;
        }
    }
    if ( specific_kind[5] != '.' )
    {
var fs = -( fg - TIDE_AMPLITUDE_LUNAR - TIDE_AMPLITUDE_SOLAR );
        if ( ( fs < 0 ) || ( fs > ( TIDE_AMPLITUDE_LUNAR + TIDE_AMPLITUDE_SOLAR ) * 2 ) )
        {
            if ( specific_kind[5] == '+' )
            {
                temp = 0;
            }
        }
        else
        {
            number_sum ++;
            if ( specific_kind[5] == '+' )
            {
                temp += OPERATOR_SALT( fg, dfg, fdg, fs );    
            }
        }
    }
    NA_ASSERT( number_sum, "number_sum is ZERO" );
    if ( number_sum != 0 )
    {
        temp = temp / number_sum;
    }
    return ( temp );
}

function land_operator_interpolated(locx, locy, kind) {
var _tmp = 0;
var map_dimension = land_map_dimension();
var map_x = APESPACE_TO_MAPSPACE( locx );
var map_y = APESPACE_TO_MAPSPACE( locy );
    var interpolated;
    NA_ASSERT( kind, "kind null" );

    
    interpolated  = ( land_operator( ( map_x + 1 ) & ( map_dimension - 1 ), map_y, kind ) * ( locx - ( map_x << APE_TO_MAP_BIT_RATIO ) ) ) >> APE_TO_MAP_BIT_RATIO;
    interpolated += ( land_operator( ( map_x - 1 ) & ( map_dimension - 1 ), map_y, kind ) * ( ( ( map_x + 1 ) << APE_TO_MAP_BIT_RATIO ) - locx ) ) >> APE_TO_MAP_BIT_RATIO;
    interpolated += ( land_operator( map_x, ( map_y + 1 ) & ( map_dimension - 1 ), kind ) * ( locy - ( map_y << APE_TO_MAP_BIT_RATIO ) ) ) >> APE_TO_MAP_BIT_RATIO;
    interpolated += ( land_operator( map_x, ( map_y - 1 ) & ( map_dimension - 1 ), kind ) * ( ( ( map_y + 1 ) << APE_TO_MAP_BIT_RATIO ) - locy ) ) >> APE_TO_MAP_BIT_RATIO;

    return interpolated >> 1;
}

function land_location_vect(value) {
var _tmp = 0;
    return land_location( value.x, value.y );
}

function weather_seven_values(px, py) {
var _tmp = 0;
    var ret_val;
    var val;
var map_x = POSITIVE_LAND_COORD( APESPACE_TO_MAPSPACE( px ) );
var map_y = POSITIVE_LAND_COORD( APESPACE_TO_MAPSPACE( py ) );

    if ( IS_DAWNDUSK( m_land.time ) )
    {
        return WEATHER_SEVEN_DAWN_DUSK;
    }
    if ( IS_NIGHT( m_land.time ) )
    {
        ret_val = WEATHER_SEVEN_CLEAR_NIGHT;
    }
    else
    {
        ret_val = WEATHER_SEVEN_SUNNY_DAY;
    }

    val = weather_pressure( map_x, map_y );

    if ( val == -1 )
    {
        return WEATHER_SEVEN_ERROR; 
    }

    if ( val > WEATHER_RAIN )
    {
        return ret_val + 2;
    }
    if ( val > WEATHER_CLOUD )
    {
        return ret_val + 1;
    }

    return ret_val;
}

function land_map_dimension() {
var _tmp = 0;
    return MAP_DIMENSION;
}

function land_map_bits() {
var _tmp = 0;
    return MAP_BITS;
}

function land_genetics() {
var _tmp = 0;
    return m_land.tiles[0].genetics;
}

function land_topography() {
var _tmp = 0;
    return m_land.tiles[0].topography;
}

function land_weather(tile) {
var _tmp = 0;
    return m_land.tiles[tile].atmosphere;
}

function weather_cycle() {
var _tmp = 0;
    tile_cycle( m_land );
    

    tile_wind( m_land );
}

function weather_init() {
var _tmp = 0;
    tile_weather_init( m_land );
}

function weather_pressure(px, py) {
var _tmp = 0;
    return tiles_atmosphere( m_land, 0, 0, px, py );
}

function weather_wind_vector(pos, wind) {
var _tmp = 0;
    var local_pressure;
    NA_ASSERT( pos, "pos null" );
    NA_ASSERT( wind, "wind null" );

    if ( pos == 0 )
    {
        return;
    }
    if ( wind == 0 )
    {
        return;
    }

    local_pressure = weather_pressure( pos.x, pos.y );
    wind.x = local_pressure - weather_pressure( pos.x - WEATHER_TO_MAPSPACE( 1 ), pos.y );
    wind.y = local_pressure - weather_pressure( pos.x, pos.y  - WEATHER_TO_MAPSPACE( 1 ) );
}

function land_location_tile(tile) {
var _tmp = 0;
    return tiles_topography_map( m_land, tile, 0 );

}

function land_location(px, py) {
var _tmp = 0;
    return tiles_topography( m_land, 0, 0, px, py );
}

function land_tide() {
var _tmp = 0;
var current_time    = m_land.time + ( m_land.date * TIME_DAY_MINUTES );
var lunar_mins      = current_time % LUNAR_ORBIT_MINS;
var lunar_angle_256 = ( ( ( m_land.time * 255 ) / 720 ) + ( ( lunar_mins * 255 ) / LUNAR_ORBIT_MINS ) );
var solar_mins      =  current_time    % ( TIME_DAY_MINUTES * TIME_YEAR_DAYS );
var solar_angle_256 = ( solar_mins * 255 ) / ( TIME_DAY_MINUTES * TIME_YEAR_DAYS );

var lunar = math_sine( lunar_angle_256, NEW_SD_MULTIPLE / TIDE_AMPLITUDE_LUNAR );
var solar = math_sine( solar_angle_256, NEW_SD_MULTIPLE / TIDE_AMPLITUDE_SOLAR );

    NA_ASSERT( ( ( ( WATER_MAP + lunar + solar ) > -1 ) && ( ( WATER_MAP + lunar + solar ) < 256 ) ), "(WATER_MAP + lunar + solar) outside byte boundaries" );

    m_land.tide_level = ( WATER_MAP + lunar + solar );
}

function land_clear(kind, start) {
var _tmp = 0;
    tile_land_erase( m_land );
    if ( kind != KIND_LOAD_FILE )
    {
        m_land.time = 5 * TIME_HOUR_MINUTES;
        m_land.date = start;
    }
}

function land_seed_genetics(local_random) {
var _tmp = 0;
    tile_land_random( m_land, local_random );
}

function land_init() {
var _tmp = 0;
    tile_land_init( m_land );
}

function land_init_high_def(double_spread) {
var _tmp = 0;
var lp = 0;
var value_setting = 0;

    math_bilinear_8_times( m_land.tiles[0].topography[0], m_land.topography_highdef, double_spread );
    memory_erase( m_land.highres_tide, sizeof("n_byte4") * HI_RES_MAP_AREA / 32 );

    while ( lp < HI_RES_MAP_AREA )
    {
var val = m_land.topography_highdef[lp << 1];
        if ( ( val > 105 ) && ( val < 151 ) )
        {
            value_setting |= 1 << ( lp & 31 );
        }

        if ( ( lp & 31 ) == 31 )
        {
            m_land.highres_tide[ lp >> 5 ] = value_setting;
            value_setting = 0;
        }
        lp++;

    }
}

function land_vect2(output, actual_z, location) {
var _tmp = 0;
    var loc_x;
    var loc_y;
    var z;

    NA_ASSERT( output, "output null" );
    NA_ASSERT( actual_z, "actual_z null" );
    NA_ASSERT( location, "location null" );

    if ( output == 0 )
    {
        return;
    }
    if ( location == 0 )
    {
        return;
    }

    loc_x = location.x;
    loc_y = location.y;

    z = land_location( APESPACE_TO_MAPSPACE( loc_x ), APESPACE_TO_MAPSPACE( loc_y ) );

    if ( actual_z != 0 )
    {
        actual_z = z;
    }
    output.x = ( z - land_location( ( APESPACE_TO_MAPSPACE( loc_x ) + 1 ), APESPACE_TO_MAPSPACE( loc_y ) ) );
    output.y = ( z - land_location( APESPACE_TO_MAPSPACE( loc_x ), ( APESPACE_TO_MAPSPACE( loc_y ) + 1 ) ) );
    return z;
}
