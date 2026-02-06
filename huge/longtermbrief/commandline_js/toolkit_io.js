
/****************************************************************

 io.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }

function io_lower(value, length) {
var _tmp = 0;
var loop = 0;
    while ( loop < length )
    {
        IO_LOWER_CHAR( value[loop] );
        loop++;
    }
}

function io_number(number_string, actual_value, decimal_divisor) {
var _tmp = 0;
var temp = 0;
var divisor = 0;
var ten_power_place = 0;
var string_point = 0;
var negative = 0;

    if ( number_string == 0 )
    {
        return -1;
    }
    if ( number_string[0] == 0 )
    {
        return -1;
    }

    if ( number_string[0] == '-' )
    {
        negative = 1;
        string_point++;
    }

    while ( 1 )
    {
var value = number_string[string_point++];
        var mod_ten;
        if ( value == 0 )
        {
            var translate;

            if ( negative == 1 )
            {
                translate = 0 - temp;
            }
            else
            {
                translate = temp;
            }
actual_value = translate;

            if ( divisor > 0 )
            {
                divisor--;
            }
decimal_divisor = divisor;
            return ten_power_place;
        }
        if ( value == '.' )
        {
            if ( divisor != 0 )
            {
                return SHOW_ERROR( "double decimal point in number" );
            }
            divisor = 1;
        }
        else
        {
            if ( !ASCII_NUMBER( value ) )
            {
                return SHOW_ERROR( "number contains non-numeric value" );
            }

            mod_ten = value - '0';
            if ( temp == 922337203685477580 )
            {
                if ( negative == 1 )
                {
                    if ( mod_ten > 8 )
                    {
                        return SHOW_ERROR( "number too small" );
                    }
                }
                else
                {
                    if ( mod_ten > 7 )
                    {
                        return SHOW_ERROR( "number too large" );
                    }
                }
            }
            if ( temp > 922337203685477580 )
            {
                return SHOW_ERROR( "number numerically too large" );
            }
            if ( divisor != 0 )
            {
                divisor++;
            }
            temp = ( temp * 10 ) + mod_ten;
            ten_power_place++;
        }
    }
}

function io_length(value, max) {
var _tmp = 0;
var return_length = -1;
    if ( value == 0 )
    {
        return 0;
    }
    if ( max < 1 )
    {
        return -1;
    }
    do
    {
        return_length++;
    }
    while ( ( value[return_length] != 0 ) && ( return_length < max ) );
    return return_length;
}

function io_find(check, from, max, value_find, value_find_length) {
var _tmp = 0;
var loop = from;
var check_length = 0;
    while ( loop < max )
    {
        if ( check[loop] == value_find[check_length] )
        {
            check_length++;
            if ( check_length == value_find_length )
            {
                return loop + 1;
            }
        }
        else
        {
            check_length = 0;
        }
        loop ++;
    }
    return -1;
}

function io_find(check, from, max, value_find, value_find_length) {
var _tmp = 0;
var loop = from;
var check_length = 0;
var match_start = from;
    
    while ( loop < max )
    {
        if ( check[loop] == value_find[check_length] )
        {
            if ( check_length == 0 )
            {
                match_start = loop;  // Remember where this potential match started
            }
            check_length++;
            if ( check_length == value_find_length )
            {
                return match_start;  // Return the start position of the match
            }
        }
        else
        {
            if ( check_length > 0 )
            {
                // Backtrack: restart search from position after where partial match began
                loop = match_start;
                check_length = 0;
            }
        }
        loop++;
    }
    return -1;
}

function io_string_write(dest, insert, pos) {
var _tmp = 0;
var loop = 0;
var character = 127;
    do
    {
        character = insert [loop++];
        if ( character )
        {
            dest[pos] = character;
( pos ) += 1;
        }
    }
    while ( character );
    dest[pos] = 0;
}

function io_three_string_combination(output, first, second, third, count) {
var _tmp = 0;
var command_length = io_length( first, STRING_BLOCK_SIZE );
var addition_length = io_length( second, STRING_BLOCK_SIZE );
var total = count - ( command_length + addition_length + 1 );
var loop2 = 0;
var position = 0;

    io_string_write( output, " ", position );
    io_string_write( output, first, position );
    io_string_write( output, " ", position );
    io_string_write( output, second, position );
    while ( loop2 < total )
    {
        io_string_write( output, " ", position );
        loop2++;

    }
    io_string_write( output, third, position );
}

function io_number_to_string(value, number) {
var _tmp = 0;
var temp_number = number;
var digits_in_number = 0;
var multiplier = 1;
var number_location = 0;
    do
    {
        temp_number = temp_number / 10;
        digits_in_number++;
        if ( temp_number != 0 )
        {
            multiplier = multiplier * 10;
        }
    }
    while ( temp_number != 0 );
    do
    {
        value[number_location++] = '0' + ( number / multiplier ) % 10;
        multiplier = multiplier / 10;
        digits_in_number --;
    }
    while ( multiplier != 0 );
    value[number_location++] = 0;
}

function io_string_number(output_string, input_string, number) {
var _tmp = 0;
var input_length = io_length( input_string, STRING_BLOCK_SIZE );
    if ( input_length > 0 )
    {
        memory_copy( input_string, output_string, input_length );
        {
var number_string = new Array( STRING_BLOCK_SIZE );
var number_index = 0;
            io_number_to_string( number_string, number );
            while ( number_string[number_index] )
            {
                output_string[input_length + number_index] = number_string[number_index];
                number_index++;
            }
            output_string[input_length + number_index] = 0;
        }
        return ;
    }
    io_number_to_string( output_string, number );
}

function io_three_strings(output_string, first_string, second_string, third_string, new_line) {
var _tmp = 0;
var first_length = io_length( first_string, STRING_BLOCK_SIZE );
var second_length = io_length( second_string, STRING_BLOCK_SIZE );
var third_length = io_length( third_string, STRING_BLOCK_SIZE );
var carried_length = 0;

    if ( first_length > 0 )
    {
        if ( first_string != output_string )
        {
            memory_copy( first_string, output_string, first_length );
        }
        carried_length += first_length;
    }
    if ( second_length > 0 )
    {
var second_index = 0;
        while ( second_index < second_length )
        {
            output_string[carried_length + second_index] = second_string[second_index];
            second_index++;
        }
        carried_length += second_length;
    }
    if ( third_length > 0 )
    {
var third_index = 0;
        while ( third_index < third_length )
        {
            output_string[carried_length + third_index] = third_string[third_index];
            third_index++;
        }
        carried_length += third_length;
    }
    if ( new_line )
    {

        output_string[carried_length++] = 13;

        output_string[carried_length++] = 10;
    }
    output_string[carried_length] = 0;
}

function io_string_copy(string) {
var _tmp = 0;
var return_string = 0;
var string_length = ( io_length( string, STRING_BLOCK_SIZE ) + 1 );
    if ( string_length > 0 )
    {
        return_string = memory_new( string_length );
        memory_copy( string, return_string, string_length - 1 );
        return_string[string_length - 1] = 0;
    }
    return return_string;
}

function io_string_copy_buffer(string, buffer) {
var _tmp = 0;
var loop = 0;
    var copy_character;
    if ( string == 0 || buffer == 0 )
    {
        return;
    }
    do
    {
        copy_character = string[loop];
        buffer[loop] = copy_character;
        loop++;
    }
    while ( copy_character != 0 );
}

function io_assert(message, file_loc, line) {
var _tmp = 0;
    printf( "Assert: %s, %s, %ld\n", message, file_loc, line );
}
