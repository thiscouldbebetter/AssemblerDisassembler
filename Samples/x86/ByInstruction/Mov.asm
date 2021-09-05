db 'mov ax 1',0
mov ax, 1
db 'mov ax 2',0
mov ax, 2

db 'mov ax ax',0
mov ax, ax

db 'mov ax bx',0
mov ax, bx
db 'mov bx ax',0
mov bx, ax

db 'mov ax cx',0
mov ax, cx
db 'mov cx ax',0
mov cx, ax

db 'mov ax dx',0
mov ax, dx
db 'mov dx ax',0
mov dx, ax

db 'mov bx bx',0
mov bx, bx
db 'mov cx cx',0
mov cx, cx
db 'mov dx dx',0
mov dx, dx

db 'mov ax [bx]',0
mov ax, [bx]
db 'mov bx [bx]',0
mov bx, [bx]
db 'mov cx [bx]',0
mov cx, [bx]
db 'mov dx [bx]',0
mov dx, [bx]

db 'mov [bx] ax',0
mov [bx], ax

db 'mov ax [bx+1]',0
mov ax, [bx+1]
db 'mov ax [bx+2]',0
mov ax, [bx+2]
db 'mov [bx+1] ax',0
mov [bx+1], ax
