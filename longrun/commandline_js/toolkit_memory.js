
/****************************************************************

 memory.c

 =============================================================
***************************************************************/

// Auto-translated from C to JS
function sizeof(_type) { return 0; }
var static_execution = 0;

function memory_execute_set(value) {
var _tmp = 0;
    static_execution = value;
}

function memory_execute_run() {
var _tmp = 0;
    if (static_execution)
    {
        static_execution();
    }
}

function memory_copy(from, to, number) {
var _tmp = 0;
    memcpy( to, from, number );
}

function memory_new(bytes) {
var _tmp = 0;
var tmp = 0;
    if ( bytes )
    {
        tmp =  malloc( bytes );
    }
    return ( tmp );
}

function memory_free(ptr) {
var _tmp = 0;
    if ( ptr != 0 )
    {
        freeptr;
ptr = 0;
    }
}

function memory_new_range(memory_min, memory_allocated) {
var _tmp = 0;
var memory_buffer = 0;
    do
    {
        memory_buffer =  mallocmemory_allocated;
        if ( memory_buffer == 0 )
        {
            memory_allocated = ( memory_allocated * 3 ) >> 2;
        }
    }
    while ( ( memory_buffer == 0 ) && ( memory_allocated > memory_min ) );
    return memory_buffer;
}

function memory_erase(buf_offscr, nestop) {
var _tmp = 0;
    memset( buf_offscr, 0, nestop );
}

function memory_list_new(size, number) {
var _tmp = 0;
var new_list = memory_new( sizeof("memory_list") );
    if ( new_list )
    {
        new_list.data = memory_new( size * number );
        if ( new_list.data == 0 )
        {
            memory_free( new_list );
            return 0;
        }
        new_list.count = 0;
        new_list.max = number;
        new_list.unit_size = size;
    }
    return new_list;
}

function memory_list_copy(list, data, size) {
var _tmp = 0;
    memory_copy( data, ( list.data[list.unit_size * list.count] ), size );
    list.count += (size /(list.unit_size));
    if (size % (list.unit_size))
    {
        SHOW_ERROR("wrong base unit size");
    }

    if ( list.count >= list.max )
    {
var new_max = ( list.max * 2 );
var new_size = new_max * list.unit_size;
var new_range = memory_new( new_size );
        NA_ASSERT( new_range, "range failed to allocate" );
        if ( new_range )
        {
            memory_copy( list.data, new_range, new_size / 2 );
            memory_free(   ( list.data ) );
            list.max = new_max;
            list.data = new_range;
        }
    }
}

function memory_list_free(value) {
var _tmp = 0;
var list = value;
    memory_free(   ( list.data ) );
    memory_free( value );
}

function int_list_new(number) {
var _tmp = 0;
    return memory_list_new( sizeof("n_int"), number );
}

function int_list_copy(list, int_add) {
var _tmp = 0;
    memory_list_copy(list,  int_add, sizeof("int_add"));
}

function int_list_free(value) {
var _tmp = 0;
    memory_list_free(value);
}

function int_list_find(list, location, error) {
var _tmp = 0;
var data_int =  list.data;

    if ((location > list.count) || (location < 0))
    {
        error = -1;
        return SHOW_ERROR("Out of Bounds failure");
    }
error = 0;
    return data_int[location];
}

function int_list_debug(debug_list) {
var _tmp = 0;

}

function number_array_list_new() {
var _tmp = 0;
    return  memory_list_new(sizeof("number_array"), 10);
}

function number_array_list_free(nal) {
var _tmp = 0;
    memory_list_free(  nal );
}

function number_array_list_copy(nal, na) {
var _tmp = 0;
    memory_list_copy(nal, na, sizeof("number_array"));
}

function number_array_list_find(nal, array) {
var _tmp = 0;
var loop = 0;
var checkptr = nal.data;
    while (loop < nal.count)
    {
        if (checkptr[loop].array == array)
        {
            return checkptr[loop];
        }
        loop++;
    }
    return 0;
}

function number_array_list_find_add(nal, array) {
var _tmp = 0;
var loop = 0;
var checkptr = nal.data;
    while (loop < nal.count)
    {
        if (checkptr[loop].array == array)
        {
            return checkptr[loop];
        }
        loop++;
    }

var return_value = memory_new(sizeof("number_array"));
    return_value.array = array;
    return_value.number = int_list_new(8);

    number_array_list_copy(nal, return_value);

    return return_value;
}

function number_array_not_number(na) {
var _tmp = 0;
    if (na)
    {
        if (na.number)
        {
            int_list_free((na.number));
        }
        SHOW_ERROR("number array values not present (clear)");
    }
    SHOW_ERROR("number array not present (clear)");
}

function number_array_number(na, number) {
var _tmp = 0;
    if (na)
    {
        if (na.number)
        {
            int_list_copy(na.number, number);
        }
        else
        {
            SHOW_ERROR("number array values not present (copy)");
            return;
        }
    }
    else
    {
        SHOW_ERROR("number array not present (copy)");
    }
}

function number_array_get_number(na, location, error) {
var _tmp = 0;
    if (na)
    {
        if (na.number)
        {
            return int_list_find(na.number, location, error);
        }
error = -3;
        return SHOW_ERROR("number array values not present");
    }
error = -2;
    return SHOW_ERROR("number array not present");
}

function number_array_get_size(na) {
var _tmp = 0;
    if (na)
    {
        if (na.number)
        {
            return na.number.count;
        }
        return SHOW_ERROR("number array values not present (size)");
    }
    return SHOW_ERROR("number array not present (size)");
}