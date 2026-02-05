
/****************************************************************

 tile.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var tile_wind_aim = null;
var tile_wind_dissipation = null;
var bits_neg = ((-131072 * 254) / 256);
var bits_pos = (( 131071 * 254) / 256);

function tile_coordinate_rotate(coordinates, rotate90, tile) {
var _tmp = 0;
var pos_x = ( coordinates.x + MAP_DIMENSION ) & ( MAP_DIMENSION - 1 );
var pos_y = ( coordinates.y + MAP_DIMENSION ) & ( MAP_DIMENSION - 1 );
var pos_facing = coordinates.facing;

    if ( rotate90 == 0 )
    {
        coordinates.x = pos_x;
        coordinates.y = pos_y;
    }
    if ( rotate90 == 1 )
    {
        coordinates.facing = ( pos_facing + 64 ) & 255;
        coordinates.x = pos_y;
        coordinates.y = MAP_DIMENSION - 1 - pos_x;
    }
    if ( rotate90 == 2 )
    {
        coordinates.facing = ( pos_facing + 128 ) & 255;
        coordinates.x = MAP_DIMENSION - 1 - pos_x;
        coordinates.y = MAP_DIMENSION - 1 - pos_y;
    }
    if ( rotate90 == 3 )
    {
        coordinates.facing = ( pos_facing + 64 + 128 ) & 255;
        coordinates.x = MAP_DIMENSION - 1 - pos_y;
        coordinates.y = pos_x;
    }
    coordinates.tile = tile;
}

function tile_resolve_coordinates(coordinates) {
var _tmp = 0;
var pos_x = ( coordinates.x >= MAP_DIMENSION ) - ( coordinates.x < 0 );
var pos_y = ( coordinates.y >= MAP_DIMENSION ) - ( coordinates.y < 0 );

    if ( MAP_TILES == 1 )
    {
        if ( coordinates.x > ( MAP_DIMENSION - 1 ) )
        {
            coordinates.x = ( MAP_DIMENSION - 1 );
        }
        else if ( coordinates.x < 0 )
        {
            coordinates.x = 0;
        }
        if ( coordinates.y > ( MAP_DIMENSION - 1 ) )
        {
            coordinates.y = ( MAP_DIMENSION - 1 );
        }
        else if ( coordinates.y < 0 )
        {
            coordinates.y = 0;
        }
        coordinates.tile = 0;
        return;
    }
    if ( ( pos_x == 0 ) && ( pos_y == 0 ) )
    {
        return;
    }
    if ( pos_y == 0 )
    {
        if ( ( coordinates.tile > 0 ) && ( coordinates.tile < 5 ) )
        {
var new_x = ( coordinates.x + MAP_DIMENSION ) & ( MAP_DIMENSION - 1 );
var new_tile = coordinates.tile;
            if ( pos_x < 0 )
            {
                if ( new_tile == 1 ) 
                {
                    new_tile = 4;
                }
                else
                {
                    new_tile--;
                }
            }
            else
            {
                if ( new_tile == 4 ) 
                {
                    new_tile = 1;
                }
                else
                {
                    new_tile++;
                }
            }
            coordinates.tile = new_tile;
            coordinates.x = new_x;
        }
        else
        {
            if ( coordinates.tile == 0 )
            {
                if ( pos_x < 0 )
                {
                     tile_coordinate_rotate( coordinates, 3, 1 );
                }
                else
                {
                     tile_coordinate_rotate( coordinates, 1, 3 );
                }
            }
            else 
            {
                if ( pos_x < 0 )
                {
                     tile_coordinate_rotate( coordinates, 3, 1 );
                }
                else
                {
                     tile_coordinate_rotate( coordinates, 1, 3 );
                }
            }
            
        }
    }
    else if ( pos_x == 0 )
    {
        if ( ( coordinates.tile == 0 ) || ( coordinates.tile == 2 ) || ( coordinates.tile == 5 ) )
        {
var new_y = ( coordinates.y + MAP_DIMENSION ) & ( MAP_DIMENSION - 1 );
var new_tile = -1;
            if ( pos_y < 0 )
            {
                if ( coordinates.tile == 0 )
                {
                    tile_coordinate_rotate( coordinates, 2, 4 );
                }
                if ( coordinates.tile == 2 )
                {
                    new_tile = 0;
                }
                if ( coordinates.tile == 5 )
                {
                    new_tile = 2;
                }
            }
            else
            {
                if ( coordinates.tile == 0 )
                {
                    new_tile = 2;
                }
                if ( coordinates.tile == 2 )
                {
                    new_tile = 5;
                }
                if ( coordinates.tile == 5 ) 
                {
                    tile_coordinate_rotate( coordinates, 2, 4 );
                }
            }

            if ( new_tile != -1 )
            {
                coordinates.tile = new_tile;
                coordinates.y = new_y;
            }
        }
        else
        {
            

            if ( pos_y < 0 )
            {
                if ( coordinates.tile == 1 )
                {
                     tile_coordinate_rotate( coordinates, 1, 0 );
                }
                if ( coordinates.tile == 3 )
                {
                     tile_coordinate_rotate( coordinates, 3, 0 );
                }
                if ( coordinates.tile == 4 )
                {
                     tile_coordinate_rotate( coordinates, 2, 0 );
                }
            }
            else
            {
                if ( coordinates.tile == 1 )
                {
                     tile_coordinate_rotate( coordinates, 3, 5 );
                }
                if ( coordinates.tile == 3 )
                {
                     tile_coordinate_rotate( coordinates, 1, 5 );
                }
                if ( coordinates.tile == 4 )
                {
                     tile_coordinate_rotate( coordinates, 2, 5 );
                }
            }

        }
    }
    else
    {
        if ( coordinates.x > ( MAP_DIMENSION - 1 ) )
        {
            coordinates.x = ( MAP_DIMENSION - 1 );
        }
        else if ( coordinates.x < 0 )
        {
            coordinates.x = 0;
        }
        if ( coordinates.y > ( MAP_DIMENSION - 1 ) )
        {
            coordinates.y = ( MAP_DIMENSION - 1 );
        }
        else if ( coordinates.y < 0 )
        {
            coordinates.y = 0;
        }
    }
}

function tile_wrap(land, tile) {
var _tmp = 0;
var section = land.tiles[tile].atmosphere[1];
var placement = 0;
    while ( placement < ( MAP_AREA ) )
    {
var value = section[placement];
        section[placement++] = ( value * 253 ) / 256;
    }
}

function tile_wind_calculation(land) {
var _tmp = 0;
    if ( ( math_random( land.genetics ) & 31 ) == 0 )
    {
        land.wind_aim_x = tile_wind_aim;
        math_random3( land.genetics );
        land.wind_aim_y = tile_wind_aim;

        land.wind_dissipation = tile_wind_dissipation;
    }

    if ( land.wind_aim_x > land.wind_value_x )
    {
        land.wind_value_x++;
    }
    if ( land.wind_aim_x < land.wind_value_x )
    {
        land.wind_value_x--;
    }

    if ( land.wind_aim_y > land.wind_value_y )
    {
        land.wind_value_y++;
    }
    if ( land.wind_aim_y < land.wind_value_y )
    {
        land.wind_value_y--;
    }
}

function tile_pressure_range(tile, value) {
var _tmp = 0;
    if ( value > tile.delta_pressure_highest )
    {
        tile.delta_pressure_highest = value;
    }
    if ( value < tile.delta_pressure_lowest )
    {
        tile.delta_pressure_lowest = value;
    }
}

function tile_atmosphere_range(land, tile, value) {
var _tmp = 0;
var tilePtr = land.tiles[tile];

    if ( value > tilePtr.atmosphere_highest )
    {
        tilePtr.atmosphere_highest = value;
    }
    if ( value < tilePtr.atmosphere_lowest )
    {
        tilePtr.atmosphere_lowest = value;
    }
}

function tiles_non_planet(lx, ly) {
var _tmp = 0;
var converted_x = ( lx + MAP_DIMENSION ) & ( MAP_DIMENSION - 1 );
var converted_y = ( ly + MAP_DIMENSION ) & ( MAP_DIMENSION - 1 );
    return ( converted_x | ( converted_y * MAP_DIMENSION ) );
}

function tiles_atmosphere(land, tile, buffer, lx, ly) {
var _tmp = 0;

    var coord = {};
    coord.facing = 0;
    coord.tile = tile;
    coord.x = lx;
    coord.y = ly;

    tile_resolve_coordinates( coord );
    return land.tiles[coord.tile].atmosphere[buffer][tiles_non_planet( coord.x, coord.y )];


    return land.tiles[tile].atmosphere[buffer][tiles_non_planet( lx, ly )];

}

function tiles_set_atmosphere(land, tile, buffer, lx, ly, value) {
var _tmp = 0;

    var coord = {};

    coord.facing = 0;
    coord.tile = tile;
    coord.x = lx;
    coord.y = ly;

    tile_resolve_coordinates( coord );
    land.tiles[coord.tile].atmosphere[buffer][tiles_non_planet( coord.x, coord.y )] = value;


    land.tiles[tile].atmosphere[buffer][tiles_non_planet( lx, ly )] = value;

}

function tiles_swap_atmosphere(land, tile) {
var _tmp = 0;
    memory_copy( land.tiles[tile].atmosphere[1], land.tiles[tile].atmosphere[0], ( sizeof("n_c_int") * MAP_AREA ) );
}

function tiles_pressure(land, tile, lx, ly) {
var _tmp = 0;

    var coord = {};
    coord.facing = 0;
    coord.tile = tile;
    coord.x = lx;
    coord.y = ly;

    tile_resolve_coordinates( coord );
    return land.tiles[coord.tile].delta_pressure[tiles_non_planet( coord.x, coord.y )];

    return land.tiles[tile].delta_pressure[tiles_non_planet( lx, ly )];

}

function tiles_set_pressure(land, tile, lx, ly, value) {
var _tmp = 0;

    var coord = {};

    coord.facing = 0;
    coord.tile = tile;
    coord.x = lx;
    coord.y = ly;

    tile_resolve_coordinates( coord );
    land.tiles[coord.tile].delta_pressure[tiles_non_planet( coord.x, coord.y )] = value;

    land.tiles[tile].delta_pressure[tiles_non_planet( lx, ly )] = value;

}

function tiles_topography_map(land, tile, buffer) {
var _tmp = 0;
    return  land.tiles[tile].topography[buffer];
}

function tiles_topography(land, tile, buffer, lx, ly) {
var _tmp = 0;

    var coord = {};
    coord.facing = 0;
    coord.tile = tile;
    coord.x = lx;
    coord.y = ly;

    tile_resolve_coordinates( coord );
    return land.tiles[coord.tile].topography[buffer][tiles_non_planet( coord.x, coord.y )];

    return land.tiles[tile].topography[buffer][tiles_non_planet( lx, ly )];

}

function tiles_set_topography(land, tile, buffer, lx, ly, value) {
var _tmp = 0;

    var coord = {};

    coord.facing = 0;
    coord.tile = tile;
    coord.x = lx;
    coord.y = ly;

    tile_resolve_coordinates( coord );
    land.tiles[coord.tile].topography[buffer][tiles_non_planet( coord.x, coord.y )] = value;

    land.tiles[tile].topography[buffer][tiles_non_planet( lx, ly )] = value;

}

function tiles_swap_topography(land, tile) {
var _tmp = 0;
    memory_copy( land.tiles[tile].topography[0], land.tiles[tile].topography[1], MAP_AREA );
}

function tile_pack_atmosphere(land, tile) {
var _tmp = 0;
var loop = 0;
    while ( loop < MAP_AREA )
    {
        land.tiles[tile].atmosphere[0][loop] = 0;
        loop++;
    }
}

function tile_pack_topography(land, tile) {
var _tmp = 0;
var loop = 0;
    while ( loop < MAP_AREA )
    {
        land.tiles[tile].topography[0][loop] = 128;
        loop++;
    }
}

function tile_atmosphere_topography(land, tile) {
var _tmp = 0;
var loop = 0;

    while ( loop < MAP_AREA )
    {
        land.tiles[tile].atmosphere[0][ loop ] = ( land.tiles[tile].topography[0][ loop ] * 4 );
        loop++;
    }
}

function tile_cycle(land) {
var _tmp = 0;
var dissipation = ( land.wind_dissipation + 1020 );
var tile = 0;

    while ( tile < MAP_TILES )
    {
var new_delta = 0;
var ly = 0;

        land.tiles[tile].atmosphere_lowest = bits_pos;
        land.tiles[tile].atmosphere_highest = bits_neg;

        while ( ly < MAP_DIMENSION )
        {
var lx = 0;
            while ( lx < MAP_DIMENSION )
            {
var value = ( dissipation * tiles_atmosphere( land, tile, 0, lx, ly ) ) >> 10;

                var local_atm =
                    ( 2 * tiles_atmosphere( land, tile, 0, lx, ly - 1 ) )
                    + ( 2 * tiles_atmosphere( land, tile, 0, lx - 1, ly ) )
                    - ( 2 * tiles_atmosphere( land, tile, 0, lx + 1, ly ) )
                    - ( 2 * tiles_atmosphere( land, tile, 0, lx, ly + 1 ) );

                if (local_atm > max_atm)
                {
                    max_atm = local_atm;
                    max_x = lx;
                    max_y = ly;
                }
                if (min_atm > local_atm)
                {
                    min_atm = local_atm;
                    min_x = lx;
                    min_y = ly;
                }

                value +=  ( ( local_atm - land.tiles[tile].local_delta ) >> MAP_BITS ) + tiles_pressure( land, 0, lx, ly );

                tiles_set_atmosphere( land, tile, 1, lx, ly, value );
                new_delta += value;
                tile_atmosphere_range( land, tile, value );
                lx++;
            }
            ly++;
        }

        land.tiles[tile].local_delta = new_delta >> MAP_BITS;
        tile++;
    }
    tile = 0;
    while ( tile < MAP_TILES )
    {
        tiles_swap_atmosphere( land, tile );
        tile++;
    }
}

function tile_wind_pp(land) {
var _tmp = 0;
var tile = 0;
    
var p01 = land.wind_value_x, p10 = land.wind_value_y;
    while ( tile < MAP_TILES )
    {
var ly = 0;
        while ( ly < MAP_DIMENSION )
        {
var lx = 0;
            while ( lx < MAP_DIMENSION )
            {
var delta_pressure = tiles_pressure( land, tile, lx, ly );
var tp01 = ( p01 * delta_pressure ) / land.tiles[tile].delta_pressure_highest;
var tp10 = ( p10 * delta_pressure ) / land.tiles[tile].delta_pressure_highest;
var tp00 = 256 - tp01 - tp10;
                var local_atm =
                    ( tp00 * tiles_atmosphere( land, tile, 0, lx, ly ) ) +
                    ( tp10 * tiles_atmosphere( land, tile, 0, lx, ly + 1 ) ) +
                    ( tp01 * tiles_atmosphere( land, tile, 0, lx + 1, ly ) );
                tiles_set_atmosphere( land, tile, 1, lx, ly, local_atm >> 8 );
                lx++;
            }
            ly++;
        }
        tile++;
    }
}

function tile_wind_np(land) {
var _tmp = 0;
var tile = 0;
    
var p01 = land.wind_value_x, p10 = 0 - land.wind_value_y;
    while ( tile < MAP_TILES )
    {
var ly = 0;
        while ( ly < MAP_DIMENSION )
        {
var lx = 0;
            while ( lx < MAP_DIMENSION )
            {
var delta_pressure = tiles_pressure( land, tile, lx, ly );
var tp01 = ( p01 * delta_pressure ) / land.tiles[tile].delta_pressure_highest;
var tp10 = ( p10 * delta_pressure ) / land.tiles[tile].delta_pressure_highest;
var tp00 = 256 - tp01 - tp10;
                var local_atm =
                    ( tp00 * tiles_atmosphere( land, tile, 0, lx, ly ) ) +
                    ( tp10 * tiles_atmosphere( land, tile, 0, lx, ly - 1 ) ) +
                    ( tp01 * tiles_atmosphere( land, tile, 0, lx + 1, ly ) );
                tiles_set_atmosphere( land, tile, 1, lx, ly, local_atm >> 8 );
                lx++;
            }
            ly++;
        }
        tile++;
    }
}

function tile_wind_pn(land) {
var _tmp = 0;
var tile = 0;
    
var p01 = 0 - land.wind_value_x, p10 = land.wind_value_y;
    while ( tile < MAP_TILES )
    {
var ly = 0;
        while ( ly < MAP_DIMENSION )
        {
var lx = 0;
            while ( lx < MAP_DIMENSION )
            {
var delta_pressure = tiles_pressure( land, tile, lx, ly );
var tp01 = ( p01 * delta_pressure ) / land.tiles[tile].delta_pressure_highest;
var tp10 = ( p10 * delta_pressure ) / land.tiles[tile].delta_pressure_highest;
var tp00 = 256 - tp01 - tp10;
                var local_atm =
                    ( tp00 * tiles_atmosphere( land, tile, 0, lx, ly ) ) +
                    ( tp10 * tiles_atmosphere( land, tile, 0, lx, ly + 1 ) ) +
                    ( tp01 * tiles_atmosphere( land, tile, 0, lx - 1, ly ) );
                tiles_set_atmosphere( land, tile, 1, lx, ly, local_atm >> 8 );
                lx++;
            }
            ly++;
        }
        tile++;
    }
}

function tile_wind_nn(land) {
var _tmp = 0;
var tile = 0;
    
var p01 = 0 - land.wind_value_x, p10 = 0 - land.wind_value_y;
    while ( tile < MAP_TILES )
    {
var ly = 0;
        while ( ly < MAP_DIMENSION )
        {
var lx = 0;
            while ( lx < MAP_DIMENSION )
            {
var delta_pressure = tiles_pressure( land, tile, lx, ly );
var tp01 = ( p01 * delta_pressure ) / land.tiles[tile].delta_pressure_highest;
var tp10 = ( p10 * delta_pressure ) / land.tiles[tile].delta_pressure_highest;
var tp00 = 256 - tp01 - tp10;
                var local_atm =
                    ( tp00 * tiles_atmosphere( land, tile, 0, lx, ly ) ) +
                    ( tp10 * tiles_atmosphere( land, tile, 0, lx, ly - 1 ) ) +
                    ( tp01 * tiles_atmosphere( land, tile, 0, lx - 1, ly ) );
                tiles_set_atmosphere( land, tile, 1, lx, ly, local_atm >> 8 );
                lx++;
            }
            ly++;
        }
        tile++;
    }
}

function tile_wind(land) {
var _tmp = 0;
var tile = 0, p01, p10;
    tile_wind_calculation( land );
    p01 = land.wind_value_x;
    p10 = land.wind_value_y;
    if ( p01 > -1 )
    {
        if ( p10 > -1 )
        {
            tile_wind_pp( land );
        }
        else
        {
            tile_wind_np( land );
        }
    }
    else
    {
        if ( p10 > -1 )
        {
            tile_wind_pn( land );
        }
        else
        {
            tile_wind_nn( land );
        }
    }
    while ( tile < MAP_TILES )
    {
        if ( ( land.tiles[tile].atmosphere_lowest < bits_neg ) || ( land.tiles[tile].atmosphere_highest > bits_pos ) )
        {
            tile_wrap( land, tile );
        }
        tile++;
    }
    tile = 0;
    while ( tile < MAP_TILES )
    {
        tiles_swap_atmosphere( land, tile );
        tile++;
    }
}

function tile_weather_init(land) {
var _tmp = 0;
var tile = 0;

    land.wind_value_x = tile_wind_aim;
    land.wind_aim_y = tile_wind_aim;
    math_random3( land.genetics );
    land.wind_value_y = tile_wind_aim;
    land.wind_aim_x = tile_wind_aim;

    land.wind_dissipation = tile_wind_dissipation;

    while ( tile < MAP_TILES )
    {
var tilePtr = land.tiles[tile];

        math_random3( tilePtr.genetics );

        tilePtr.local_delta = 0;

        tilePtr.delta_pressure_lowest = 0xffff;
        tilePtr.delta_pressure_highest = 1;


        memory_erase( tilePtr.atmosphere, sizeof("n_c_int") * MAP_AREA );
        memory_erase( tilePtr.delta_pressure, sizeof("n_byte2") * MAP_AREA );

        tile_atmosphere_topography( land, tile );

        tile++;
    }
    tile = 0;
    while ( tile < MAP_TILES )
    {
var ly = 0;
        while ( ly < MAP_DIMENSION )
        {
var lx = 0;
            while ( lx < MAP_DIMENSION )
            {
                var value
                    = (
                          tiles_atmosphere( land, tile, 0, lx + 1, ly )
                          - tiles_atmosphere( land, tile, 0, lx - 1, ly )
                          + tiles_atmosphere( land, tile, 0, lx, ly + 1 )
                          - tiles_atmosphere( land, tile, 0, lx, ly - 1 )
                          + 512 );
                tiles_set_pressure( land, tile, lx, ly, value );
                tile_pressure_range( land.tiles[tile], value );
                lx++;
            }
            ly++;
        }
        tile++;
    }
    tile = 0;

    while ( tile < MAP_TILES )

    while ( tile < ( MAP_TILES / 2 ) )

    {
        tile_pack_atmosphere( land, tile );
        tile++;
    }
}

function tile_land_erase(land) {
var _tmp = 0;
    var save_genetics = new Array( MAP_TILES );
var tile = 0;
    while ( tile < MAP_TILES )
    {
        if ( !save_genetics[tile] )
        {
            save_genetics[tile] = [0, 0];
        }
        save_genetics[tile][0] = land.tiles[tile].genetics[0];
        save_genetics[tile][1] = land.tiles[tile].genetics[1];
        tile++;
    }

    memory_erase( land, sizeof("n_land") );

    tile = 0;
    while ( tile < MAP_TILES )
    {
        land.tiles[tile].genetics[0] = save_genetics[tile][0];
        land.tiles[tile].genetics[1] = save_genetics[tile][1];
        tile_pack_topography( land, tile );
        tile++;
    }
}

function tile_round(land, tile) {
var _tmp = 0;
var local_tile_dimension = 1 << MAP_BITS;
var span_minor = 0;
    

    while ( span_minor < 6 )
    {
var py = 0;

        while ( py < local_tile_dimension )
        {
var px = 0;
            while ( px < local_tile_dimension )
            {
var sum = 0;
var ty = -1;
                while ( ty < 2 )
                {
var tx = -1;
                    while ( tx < 2 )
                    {
                        sum += tiles_topography( land, tile, ( span_minor & 1 ), px + tx, py + ty );
                        tx++;
                    }
                    ty++;
                }
                tiles_set_topography( land, tile, ( span_minor & 1 ) ^ 1, px, py, ( sum / 9 ) );
                px ++;
            }
            py ++;
        }
        span_minor ++;
    }
}

function tile_patch(land, tile, refine) {
var _tmp = 0;
    
    
var local_tiles = 1 << ( MAP_BITS - 8 );
var span_minor = ( 64 >> ( ( refine & 7 ) ^ 7 ) );
var span_major = ( 1 << ( ( refine & 7 ) ^ 7 ) );
var tile_y = 0;

    
    while ( tile_y < local_tiles )
    {
        
var tile_x = 0;
        while ( tile_x < local_tiles )
        {
            
var py = 0;
            while ( py < span_minor )
            {
var px = 0;
                while ( px < span_minor )
                {
                    
var val1 = ( ( px << 2 ) + ( py << 10 ) );
var ty = 0;
var tseed = math_random( land.tiles[tile].genetics );

                    while ( ty < 4 )
                    {
var tx = 0;
                        while ( tx < 4 )
                        {
var val2 = ( tseed >> ( tx | ( ty << 2 ) ) );
var val3 = ( ( ( ( val2 & 1 ) << 1 ) - 1 ) * 20 );
var my = 0;

                            val2 = ( tx | ( ty << 8 ) );

                            while ( my < span_major )
                            {
var mx = 0;
                                while ( mx < span_major )
                                {
var point = ( ( mx | ( my << 8 ) ) + ( span_major * ( val1 + val2 ) ) );
var pointx = ( point & 255 );
var pointy = ( point >> 8 );
                                    
                                    if ( refine & 2 )
                                    {
var pointx_tmp = pointx + pointy;
                                        pointy = pointx - pointy;
                                        pointx = pointx_tmp;
                                    }
                                    {
                                        
var local_map_point = tiles_topography( land, tile, 0, pointx + ( tile_x << 8 ), pointy + ( tile_y << 8 ) ) + val3;

                                        if ( local_map_point < 0 )
                                        {
                                            local_map_point = 0;
                                        }
                                        if ( local_map_point > 255 )
                                        {
                                            local_map_point = 255;
                                        }

                                        tiles_set_topography( land, tile, 0, pointx + ( tile_x << 8 ), pointy + ( tile_y << 8 ), local_map_point );
                                    }
                                    mx++;
                                }
                                my++;
                            }
                            tx++;
                        }
                        ty++;
                    }
                    px++;
                }
                py++;
            }
            tile_x++;
        }
        tile_y++;
    }

}

function tile_memory_location(px, py) {
var _tmp = 0;

    return POSITIVE_TILE_COORD( px ) + ( POSITIVE_TILE_COORD( py ) << MAP_BITS );
}

function tile_land_init(land) {
var _tmp = 0;
var refine = 0;
    while ( refine < 7 )
    {
var tile = 0;
        while ( tile < MAP_TILES )
        {
            tile_patch( land, tile, refine );
            tile++;
        }
        tile = 0;
        while ( tile < MAP_TILES )
        {
            tile_round( land, tile );
            tile++;
        }
        tile = 0;
        while ( tile < MAP_TILES )
        {
            tiles_swap_topography( land, tile );
            tile++;
        }
        refine++;
    }
}

function tile_land_random(land, random) {
var _tmp = 0;
var tile = 0;
    while ( tile < MAP_TILES )
    {
        land.tiles[tile].genetics[0] = ( ( ( math_random( random ) & 255 ) << 8 ) | ( math_random( random ) & 255 ) );
        land.tiles[tile].genetics[1] = ( ( ( math_random( random ) & 255 ) << 8 ) | ( math_random( random ) & 255 ) );
        math_random3( random );
        tile++;
    }
    land.genetics[0] = ( ( ( math_random( random ) & 255 ) << 8 ) | ( math_random( random ) & 255 ) );
    land.genetics[1] = ( ( ( math_random( random ) & 255 ) << 8 ) | ( math_random( random ) & 255 ) );
}
