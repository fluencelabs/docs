# Interface types instructions

This section briefly describes full list of supported interface-types instructions:

`arg.get` - pushes to the operand stack an argument by its id

`array.lift_memory` -  takes a pointer and a size from the operand stack, lifts an array from them, pushing it then back to the operand stack

`array.lower_memory` - takes an array from the operand stack and lowers it to the provided pointer

`bytearray.lift_memory` - takes a pointer and a size from the operand stack, lifts a bytearray from them, pushing it then back to the operand stack

`bytearray.lower_memory` - takes a bytearray and a pointer from the operand stack and writes the given bytearray to the provided pointer

`bytearray.size` - takes a bytearray from the operand stack, producing its size on the operand stack

`call-core` - calls either an export adaptor or an export from a Wasm module function

`dup` - duplicates the last value on the operand stack

`record.lift` -  takes a pointer and a size from the operand stack, lifts a record from them

`record.lower` - takes a record from the operand stack and lowers it, producing a pointer to the result back to the operand stack

`string.lift_memory` - takes a pointer and a size from the operand stack, lifts a string from them, pushing it then back to the operand stack

`string.lower_memory` - takes a string and a pointer from the operand stack and writes the given string to the provided pointer

`string.size` - takes a string from the operand stack, producing its size on the operand stack

`swap` - swaps two top elements on the operand stack

`<target number_type>.from_<source number_type>` - converts the source number\_type to the target number\_type

`<number_type>.push` - pushes a provided value of number\_type to the operand stack

