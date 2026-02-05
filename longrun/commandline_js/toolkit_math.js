
/****************************************************************

 math.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var debug_random_count = 0;
var tmp0 = seed[0];
var tmp1 = seed[1];
var runIt = 1;
var tempAnd7 = tmp0 & 7;

function math_join(sx, sy, dx, dy, draw) {
var _tmp = 0;
var px = sx;
var py = sy;

    var local_draw;
    var local_info;

    NA_ASSERT( draw, "draw null" );

    if ( draw == 0 )
    {
        return 1;
    }
    if ( draw.pixel_draw == 0 )
    {
        return 1;
    }

    local_draw = draw.pixel_draw;
    local_info = draw.information;

    NA_ASSERT( local_draw, "local_draw null" );
    NA_ASSERT( local_info, "local_info null" );

    if ( local_draw( px, py, 0, 0, local_info ) )
    {
        return 1;
    }
    if ( ( dx == 0 ) && ( dy == 0 ) )
    {
        return 0;
    }
    {
var dxabs = dx;
var dyabs = dy;

var sdx = ( dxabs != 0 );
var sdy = ( dyabs != 0 );
        if ( dxabs < 0 )
        {
            dxabs = 0 - dxabs;
            sdx = -1;
        }
        if ( dyabs < 0 )
        {
            dyabs = 0 - dyabs;
            sdy = -1;
        }
        if ( dxabs >= dyabs )
        {
var y2 = dxabs >> 1;
var i = 0;
            while ( i++ < dxabs )
            {
                y2 += dyabs;
                if ( y2 >= dxabs )
                {
                    y2 -= dxabs;
                    py += sdy;
                }
                px += sdx;
                if ( local_draw( px, py, sdx, sdy, local_info ) )
                {
                    return 1;
                }
            }
        }
        else
        {
var x2 = dyabs >> 1;
var i = 0;
            while ( i++ < dyabs )
            {
                x2 += dxabs;
                if ( x2 >= dyabs )
                {
                    x2 -= dyabs;
                    px += sdx;
                }
                py += sdy;
                if ( local_draw( px, py, sdx, sdy, local_info ) )
                {
                    return 1;
                }
            }
        }
    }
    return 0;
}

function math_join_vect2(sx, sy, vect, draw) {
var _tmp = 0;
    return math_join( sx, sy, vect.x, vect.y, draw );
}

function math_line_vect(point1, point2, draw) {
var _tmp = 0;
    var delta = vect2_new();
    vect2_subtract( delta, point2, point1 );
    return math_join( point1.x, point1.y, delta.x, delta.y, draw );
}

function math_line(x1, y1, x2, y2, draw) {
var _tmp = 0;
var dx = x2 - x1;
var dy = y2 - y1;
    return math_join( x1, y1, dx, dy, draw );
}

function math_hash_fnv1(key) {
var _tmp = 0;
var hash = 2166136261;
    while (key)
    {
        hash = ( 16777619 * hash ) ^ ( key++ );
    }
    return hash;
}

function math_hash(values, length) {
var _tmp = 0;
var loop = 0;
    var round = [0xfa78, 0xfad7, 0x53e7, 0xa728, 0x2c81];

    NA_ASSERT( values, "values null" );

    if ( sizeof("n_uint") == 8 )
    {
        var big_round = new Array(4);

        while ( loop < length )
        {
            round[0] ^= round[4];
            round[1] ^= values[loop++];
            math_random3( round );
            math_random3( round[1] );
            math_random3( round[2] );
            math_random3( round[3] );
        }
        big_round[0] = round[0];
        big_round[1] = round[1];
        big_round[2] = round[2];
        big_round[3] = round[3];

        return big_round[0] | ( big_round[1] << 16 ) | ( big_round[2] << 32 ) | ( big_round[3] << 48 );
    }

    while ( loop < length )
    {
        round[1] ^= values[loop++];
        math_random3( round );
    }
    return ( round[0] | ( round[1] << 16 ) );
}

function math_tan(p) {
var _tmp = 0;
var return_value = 0, best_p;
    var vector_facing;
var check_switch = 128;
    vect2_direction( vector_facing, 0, 8 );
    best_p = vect2_dot( p, vector_facing, 1, 1 );

    do
    {
        var temp_p;
        vect2_direction( vector_facing, return_value + check_switch, 8 );
        temp_p = vect2_dot( p, vector_facing, 1, 1 );
        if (temp_p > best_p)
        {
            best_p = temp_p;
            return_value += check_switch;
        }

        vect2_direction( vector_facing, return_value - check_switch + 256, 8 );
        temp_p = vect2_dot( p, vector_facing, 1, 1 );
        if (temp_p > best_p)
        {
            best_p = temp_p;
            return_value -= check_switch;
        }
        check_switch = check_switch >> 1;
    }
    while (check_switch);
    return (return_value + 256) & 255;
}

function math_spline(start_vector, end_vector, elements, number_elements) {
var _tmp = 0;
    if (number_elements == 0)
    {
        return -1;
    }

    var start, end;

    vect2_subtract( start, start_vector[1], start_vector[0] );
    vect2_subtract( end, end_vector[1], end_vector[0] );

var tan_start = math_tan(start);
var tan_end = math_tan(end);
var tan_new = tan_start;
    var tan_delta;

    if (tan_start > tan_end)
    {
        tan_end += 256;
    }

    tan_delta = (tan_end - tan_start) / number_elements;

    

var loop = 0;

    var span = vect2_new();

    span.x = start_vector[1].x;
    span.y = start_vector[1].y;

    while (loop < number_elements)
    {
        var direction = vect2_new();
        tan_new += tan_delta;
        vect2_direction(direction, tan_new, 1);
        vect2_delta(span, direction);
        loop++;
    }

var dx = (end_vector[0].x - start_vector[1].x);
var dy = (end_vector[0].y - start_vector[1].y);
var dix = (span.x - start_vector[1].x);
var diy = (span.y - start_vector[1].y);

var divisor = 0;

    if (dx && dy)
    {
        divisor = ((dix / dx) + (diy / dy)) / 2;
    }
    else
    {
        if (dx)
        {
            divisor = (dix / dx);
        }
        else if (dy)
        {
            divisor = (diy / dy);
        }
    }

    if (divisor == 0)
    {
        return -1;
    }

    
    loop = 0;

    tan_new = tan_start;

    span.x = start_vector[1].x;
    span.y = start_vector[1].y;

    while (loop < number_elements)
    {
        var direction;
        tan_new += tan_delta;
        vect2_direction(direction, tan_new, divisor);
        vect2_delta(span, direction);
        elements[loop].x = span.x;
        elements[loop].y = span.y;
        loop++;
    }

    return 0;
}

function math_spread_byte(val) {
var _tmp = 0;
var result = ( val >> 1 );

    if ( ( val & 1 ) == 1 )
    {
        result = 0 - result;
    }
    return result;
}

function math_random_debug_count(string) {
var _tmp = 0;
    printf( "debug random count (%s) %ld\n", string, debug_random_count );
}

function math_random3(local) {
var _tmp = 0;
    NA_ASSERT( local, "local null" );

    math_random( local );
    math_random( local );
    math_random( local );
}

function math_root(input) {
var _tmp = 0;
var op  = input;
var res = 0;
var one = 1 << ( ( sizeof("n_uint") * 8 ) - 2 );
    
    while ( one > op )
    {
        one >>= 2;
    }
    while ( one != 0 )
    {
        if ( op >= res + one )
        {
            op = op - ( res + one );
            res = res +  2 * one;
        }
        res >>= 1;
        one >>= 2;
    }
    return res;
}

function math_seg14(character) {
var _tmp = 0;
    return seg14[conv[character]];
}

function math_max(a, b) {
var _tmp = 0;
    return ( a < b ) ? b : a;
}

function math_min(a, b) {
var _tmp = 0;
    return !( b < a ) ? a : b;
}

function math_do_intersect(p1, q1, p2, q2) {
var _tmp = 0;
    
var dir1_x = q1.x - p1.x;
var dir1_y = q1.y - p1.y;
var dir2_x = q2.x - p2.x;
var dir2_y = q2.y - p2.y;
    
    
var cross_product = dir1_x * dir2_y - dir1_y * dir2_x;
    
    
    if (cross_product == 0)
    {
        return 0;
    }
    
    
var p2_to_p1_x = p1.x - p2.x;
var p2_to_p1_y = p1.y - p2.y;
    
    
var t1_numerator = dir2_x * p2_to_p1_y - dir2_y * p2_to_p1_x;
var t2_numerator = dir1_x * p2_to_p1_y - dir1_y * p2_to_p1_x;
    
    
    if (cross_product > 0)
    {
        return (t1_numerator >= 0 && t1_numerator <= cross_product &&
                t2_numerator >= 0 && t2_numerator <= cross_product);
    }
    else
    {
        return (t1_numerator <= 0 && t1_numerator >= cross_product &&
                t2_numerator <= 0 && t2_numerator >= cross_product);
    }
}
