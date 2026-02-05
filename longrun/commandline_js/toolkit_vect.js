
/****************************************************************

 vect.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }

function vect2_new(x, y) {
var _tmp = 0;
    return { x: x || 0, y: y || 0 };
}

function area2_add(area, vect, first) {
var _tmp = 0;
    if ( first )
    {
        area.bottom_right.x = vect.x;
        area.bottom_right.y = vect.y;

        area.top_left.x = vect.x;
        area.top_left.y = vect.y;
        return;
    }

    if ( vect.x < area.top_left.x )
    {
        area.top_left.x = vect.x;
    }
    if ( vect.y < area.top_left.y )
    {
        area.top_left.y = vect.y;
    }

    if ( vect.x > area.bottom_right.x )
    {
        area.bottom_right.x = vect.x;
    }
    if ( vect.y > area.bottom_right.y )
    {
        area.bottom_right.y = vect.y;
    }
}

function vect2_byte2(converter, input) {
var _tmp = 0;
    NA_ASSERT( converter, "converter null" );
    NA_ASSERT( input, "input null" );

    if ( converter == 0 )
    {
        return;
    }
    if ( input == 0 )
    {
        return;
    }

    converter.x = input[0];
    converter.y = input[1];
}

function vect2_add(equals, initial, second) {
var _tmp = 0;
    NA_ASSERT( equals, "equals null" );
    NA_ASSERT( initial, "initial null" );
    NA_ASSERT( second, "second null" );

    if ( equals == 0 )
    {
        return;
    }
    if ( initial == 0 )
    {
        return;
    }
    if ( second == 0 )
    {
        return;
    }

    equals.x = initial.x + second.x;
    equals.y = initial.y + second.y;
}

function vect2_center(center, initial, second) {
var _tmp = 0;
    vect2_add( center, initial, second );
    center.x = center.x / 2;
    center.y = center.y / 2;
}

function vect2_scalar_multiply(value, multiplier) {
var _tmp = 0;
    value.x = value.x * multiplier;
    value.y = value.y * multiplier;
}

function vect2_scalar_divide(value, divisor) {
var _tmp = 0;
    value.x = value.x / divisor;
    value.y = value.y / divisor;
}

function vect2_scalar_bitshiftdown(value, bitshiftdown) {
var _tmp = 0;
    value.x = value.x >> bitshiftdown;
    value.y = value.y >> bitshiftdown;
}

function vect2_subtract(equals, initial, second) {
var _tmp = 0;
    NA_ASSERT( equals, "equals null" );
    NA_ASSERT( initial, "initial null" );
    NA_ASSERT( second, "second null" );

    if ( equals == 0 )
    {
        return;
    }
    if ( initial == 0 )
    {
        return;
    }
    if ( second == 0 )
    {
        return;
    }

    equals.x = initial.x - second.x;
    equals.y = initial.y - second.y;
}

function vect2_divide(equals, initial, second, divisor) {
var _tmp = 0;
    vect2_subtract( equals, second, initial );

    if ( equals == 0 || ( divisor == 0 ) )
    {
        return;
    }
    equals.x = equals.x / divisor;
    equals.y = equals.y / divisor;
}

function vect2_multiplier(equals, initial, second, multiplier, divisor) {
var _tmp = 0;
    NA_ASSERT( equals, "equals null" );
    NA_ASSERT( initial, "initial null" );
    NA_ASSERT( second, "second null" );
    NA_ASSERT( divisor, "divisor ZERO" );

    if ( equals == 0 )
    {
        return;
    }
    if ( initial == 0 )
    {
        return;
    }
    if ( second == 0 )
    {
        return;
    }
    if ( divisor == 0 )
    {
        return;
    }

    equals.x = ( multiplier * initial.x * second.x ) / divisor;
    equals.y = ( multiplier * initial.y * second.y ) / divisor;
}

function vect2_d(initial, second, multiplier, divisor) {
var _tmp = 0;
    NA_ASSERT( initial, "initial null" );
    NA_ASSERT( second, "second null" );
    NA_ASSERT( divisor, "divisor ZERO" );

    if ( initial == 0 )
    {
        return;
    }
    if ( second == 0 )
    {
        return;
    }
    if ( divisor == 0 )
    {
        return;
    }

    initial.x += ( ( multiplier * second.x ) / divisor );
    initial.y += ( ( multiplier * second.y ) / divisor );
}

function vect2_dot(initial, second, multiplier, divisor) {
var _tmp = 0;
    NA_ASSERT( initial, "initial null" );
    NA_ASSERT( second, "second null" );
    NA_ASSERT( divisor, "divisor ZERO" );

    if ( initial == 0 )
    {
        return 0;
    }
    if ( second == 0 )
    {
        return 0;
    }

    return ( multiplier * ( ( initial.x * second.x ) + ( initial.y * second.y ) ) ) / divisor;
}

function vect2_distance_under(first, second, distance) {
var _tmp = 0;
var difference = [[0, 0]];
    var distance_squ;
    vect2_subtract( difference, first, second );
    distance_squ = ( difference.x * difference.x ) + ( difference.y * difference.y );
    return ( distance * distance ) > distance_squ;
}

function math_sine(direction, divisor) {
var _tmp = 0;
    NA_ASSERT( divisor, "divisor ZERO" );
    return new_sd[( direction ) & 255] / ( divisor );
}

function vect2_rotate90(rotation) {
var _tmp = 0;
var temp = rotation.y;
    rotation.y = 0 - rotation.x;
    rotation.x = temp;
}

function vect2_direction(initial, direction, divisor) {
var _tmp = 0;
    NA_ASSERT( initial, "initial null" );
    NA_ASSERT( divisor, "divisor ZERO" );
    initial.x = ( ( new_sd[( ( direction ) + 64 ) & 255] ) / ( divisor ) );
    initial.y = ( ( new_sd[( direction ) & 255] ) / ( divisor ) );
}

function vect2_delta(initial, delta) {
var _tmp = 0;
    NA_ASSERT( initial, "initial null" );
    NA_ASSERT( delta, "delta null" );

    if ( initial == 0 )
    {
        return;
    }
    if ( delta == 0 )
    {
        return;
    }

    initial.x += delta.x;
    initial.y += delta.y;
}

function vect2_offset(initial, dx, dy) {
var _tmp = 0;
    NA_ASSERT( initial, "initial null" );

    if ( initial == 0 )
    {
        return;
    }

    initial.x += dx;
    initial.y += dy;
}

function vect2_back_byte2(converter, output) {
var _tmp = 0;
    NA_ASSERT( converter, "converter null" );
    NA_ASSERT( output, "output null" );

    if ( converter == 0 )
    {
        return;
    }
    if ( output == 0 )
    {
        return;
    }

    if ( converter.x > 65535 )
    {
        converter.x = 65535;
    }
    if ( converter.y > 65535 )
    {
        converter.y = 65535;
    }
    if ( converter.x < 0 )
    {
        converter.x = 0;
    }
    if ( converter.y < 0 )
    {
        converter.y = 0;
    }

    output[0] =  converter.x;
    output[1] =  converter.y;
}

function vect2_copy(to, from) {
var _tmp = 0;
    to.x = from.x;
    to.y = from.y;
}

function vect2_populate(value, x, y) {
var _tmp = 0;
    value.x = x;
    value.y = y;
}

function vect2_rotation(location, rotation) {
var _tmp = 0;
    var temp = vect2_new();

    temp.x = ( ( location.x * rotation.x ) + ( location.y * rotation.y ) ) / SINE_MAXIMUM;
    temp.y = ( ( location.x * rotation.y ) - ( location.y * rotation.x ) ) / SINE_MAXIMUM;

    location.x = temp.x;
    location.y = temp.y;
}

function vect2_rotation_bitshift(location, rotation) {
var _tmp = 0;
    var temp = vect2_new();

    temp.x = ( ( location.x * rotation.x ) + ( location.y * rotation.y ) ) >> 15;
    temp.y = ( ( location.x * rotation.y ) - ( location.y * rotation.x ) ) >> 15;

    location.x = temp.x;
    location.y = temp.y;
}

function vect2_nonzero(nonzero) {
var _tmp = 0;
    return ( ( nonzero.x != 0 ) || ( nonzero.y != 0 ) );
}

function vect2_min_max_init() {
var _tmp = 0;
var min_max = memory_new( 2 * sizeof("n_vect2") );
    if ( min_max == 0 )
    {
        return 0;
    }
    vect2_populate( min_max[0], BIG_INTEGER, BIG_INTEGER );
    vect2_populate( min_max[1], BIG_NEGATIVE_INTEGER, BIG_NEGATIVE_INTEGER );
    return min_max;
}

function vect2_min_max_permutation(points, minmax) {
var _tmp = 0;
var px = points.x;
var py = points.y;
    if ( px < minmax[0].x )
    {
        minmax[0].x = px;
    }
    if ( py < minmax[0].y )
    {
        minmax[0].y = py;
    }

    if ( px > minmax[1].x )
    {
        minmax[1].x = px;
    }
    if ( py > minmax[1].y )
    {
        minmax[1].y = py;
    }
}

function vect2_min_max(points, number, maxmin) {
var _tmp = 0;
var loop = 0;

    while ( loop < number )
    {
var px = points[loop].x;
var py = points[loop].y;
        if ( px < maxmin[0].x )
        {
            maxmin[0].x = px;
        }
        if ( py < maxmin[0].y )
        {
            maxmin[0].y = py;
        }

        if ( px > maxmin[1].x )
        {
            maxmin[1].x = px;
        }
        if ( py > maxmin[1].y )
        {
            maxmin[1].y = py;
        }
        loop++;
    }
}

function vect3_double(converter, input) {
var _tmp = 0;
    NA_ASSERT( converter, "converter null" );
    NA_ASSERT( input, "input null" );

    if ( converter == 0 )
    {
        return;
    }
    if ( input == 0 )
    {
        return;
    }

    converter.x = input[0];
    converter.y = input[1];
    converter.z = input[1];
}

function vect3_add(equals, initial, second) {
var _tmp = 0;
    NA_ASSERT( equals, "equals null" );
    NA_ASSERT( initial, "initial null" );
    NA_ASSERT( second, "second null" );

    if ( equals == 0 )
    {
        return;
    }
    if ( initial == 0 )
    {
        return;
    }
    if ( second == 0 )
    {
        return;
    }

    equals.x = initial.x + second.x;
    equals.y = initial.y + second.y;
    equals.z = initial.z + second.z;
}

function vect3_center(center, initial, second) {
var _tmp = 0;
    vect3_add( center, initial, second );
    center.x = center.x / 2;
    center.y = center.y / 2;
    center.z = center.z / 2;
}

function vect3_subtract(equals, initial, second) {
var _tmp = 0;
    NA_ASSERT( equals, "equals null" );
    NA_ASSERT( initial, "initial null" );
    NA_ASSERT( second, "second null" );

    if ( equals == 0 )
    {
        return;
    }
    if ( initial == 0 )
    {
        return;
    }
    if ( second == 0 )
    {
        return;
    }

    equals.x = initial.x - second.x;
    equals.y = initial.y - second.y;
    equals.z = initial.z - second.z;
}

function vect3_divide(equals, initial, second, divisor) {
var _tmp = 0;
    vect3_subtract( equals, second, initial );

    if ( equals == 0 || ( divisor == 0 ) )
    {
        return;
    }
    equals.x = equals.x / divisor;
    equals.y = equals.y / divisor;
    equals.z = equals.z / divisor;
}

function vect3_multiplier(equals, initial, second, multiplier, divisor) {
var _tmp = 0;
    NA_ASSERT( equals, "equals null" );
    NA_ASSERT( initial, "initial null" );
    NA_ASSERT( second, "second null" );
    NA_ASSERT( divisor != 0, "divisor ZERO" );

    if ( equals == 0 )
    {
        return;
    }
    if ( initial == 0 )
    {
        return;
    }
    if ( second == 0 )
    {
        return;
    }
    if ( divisor == 0 )
    {
        return;
    }

    equals.x = ( multiplier * initial.x * second.x ) / divisor;
    equals.y = ( multiplier * initial.y * second.y ) / divisor;
    equals.z = ( multiplier * initial.z * second.z ) / divisor;
}

function vect3_d(initial, second, multiplier, divisor) {
var _tmp = 0;
    NA_ASSERT( initial, "initial null" );
    NA_ASSERT( second, "second null" );
    NA_ASSERT( divisor != 0, "divisor ZERO" );

    if ( initial == 0 )
    {
        return;
    }
    if ( second == 0 )
    {
        return;
    }
    if ( divisor == 0 )
    {
        return;
    }

    initial.x += ( ( multiplier * second.x ) / divisor );
    initial.y += ( ( multiplier * second.y ) / divisor );
    initial.z += ( ( multiplier * second.z ) / divisor );
}

function vect3_dot(initial, second, multiplier, divisor) {
var _tmp = 0;
    NA_ASSERT( initial, "initial null" );
    NA_ASSERT( second, "second null" );
    NA_ASSERT( divisor != 0, "divisor ZERO" );

    if ( initial == 0 )
    {
        return 0;
    }
    if ( second == 0 )
    {
        return 0;
    }

    return ( multiplier * ( ( initial.x * second.x ) + ( initial.y * second.y ) + ( initial.z * second.z ) ) ) / divisor;
}

function vect3_delta(initial, delta) {
var _tmp = 0;
    NA_ASSERT( initial, "initial null" );
    NA_ASSERT( delta, "delta null" );

    if ( initial == 0 )
    {
        return;
    }
    if ( delta == 0 )
    {
        return;
    }

    initial.x += delta.x;
    initial.y += delta.y;
    initial.z += delta.z;
}

function vect3_offset(initial, dx, dy, dz) {
var _tmp = 0;
    NA_ASSERT( initial, "initial null" );

    if ( initial == 0 )
    {
        return;
    }

    initial.x += dx;
    initial.y += dy;
    initial.z += dz;
}

function vect3_back_double(converter, output) {
var _tmp = 0;
    NA_ASSERT( converter, "converter null" );
    NA_ASSERT( output, "output null" );

    if ( converter == 0 )
    {
        return;
    }
    if ( output == 0 )
    {
        return;
    }

    output[0] = converter.x;
    output[1] = converter.y;
    output[2] = converter.z;
}

function vect3_copy(to, from) {
var _tmp = 0;
    to.x = from.x;
    to.y = from.y;
    to.z = from.z;
}

function vect3_populate(value, x, y, z) {
var _tmp = 0;
    value.x = x;
    value.y = y;
    value.z = z;
}

function vect3_nonzero(nonzero) {
var _tmp = 0;
    return ( ( nonzero.x != 0 ) || ( nonzero.y != 0 ) || ( nonzero.z != 0 ) );
}

function vect2_memory_list_number_array(list, number) {
var _tmp = 0;
var array = 0;

    return array;
}

function vect2_unwrap_number(array, entry, number) {
var _tmp = 0;
var out_value = 0;

    return out_value;
}

function vect2_unwrap_number_entry(pass_through, buffer, number) {
var _tmp = 0;
    return vect2_unwrap_number(  pass_through,  buffer, number);
}

function vect2_unwrap_quad(pass_through, buffer) {
var _tmp = 0;
    return vect2_unwrap_number_entry( pass_through, buffer, 4);

}

function vect2_unwrap_line(pass_through, buffer) {
var _tmp = 0;
    return vect2_unwrap_number_entry( pass_through, buffer, 2);
}
