## 第一层：C/C++ 语言基础与进阶（必修）

这一章是嵌入式软件开发的基础。无论后续学习驱动、RTOS、Linux 还是网络协议，最终都要回到数据如何表示、内存如何组织、代码如何编译和调试这些底层问题。

建议学习目标：

- 能区分常见数据类型、变量、常量、作用域和生命周期。
- 能理解栈、堆、指针、数组、字符串在内存中的关系。
- 能读懂常见的位操作、结构体、枚举、宏和修饰符用法。
- 能用编译器和调试器分析一个简单 C 程序的构建与运行过程。

---

### 变量 / 数据类型 / 关键字 / 常量

#### 变量（Variable）

变量本质上是程序中一块带名字的存储区域。程序运行时，变量名帮助我们访问某个地址上的数据。

基本规则：

- 声明时需要指定类型。
- 使用前应初始化，避免读取未定义值。
- 变量是否可见、何时创建和销毁，取决于其作用域和存储期。

```c
int count = 10;
float temperature = 36.5f;
char grade = 'A';
```

常见分类：

- 局部变量：定义在函数或代码块内部，只在当前作用域内可见。
- 全局变量：定义在函数外部，整个文件或其他文件中可见。
- 形参：函数调用时临时接收外部输入。

```c
int g_mode = 1;   // 全局变量

void print_status(void) {
    int local_count = 0;  // 局部变量
    local_count++;
}
```

工程建议：

- 局部变量优先于全局变量。
- 全局变量应限制数量，并用清晰命名表达用途。
- 嵌入式场景下，硬件寄存器镜像、状态标志、缓冲区等全局对象要特别注意并发访问。

#### 数据类型（Data Types）

数据类型决定了数据占用多少字节、如何解释这些比特、可以参与哪些运算。

常见基本类型：

- 整型：`char`、`short`、`int`、`long`、`long long`
- 无符号整型：`unsigned char`、`unsigned int` 等
- 浮点型：`float`、`double`
- 布尔型：`_Bool` 或 `stdbool.h` 中的 `bool`
- 派生类型：数组、指针、结构体、联合体、枚举

```c
#include <stdint.h>

uint8_t  status = 0x5A;
int32_t  speed = -120;
float    voltage = 3.3f;
double   ratio = 1.0 / 3.0;
```

在嵌入式开发中，推荐优先使用固定宽度整数类型：

- `uint8_t`、`int16_t`、`uint32_t`
- 好处是跨平台时大小明确，便于寄存器映射、通信协议和文件格式定义

注意：

- `int`、`long` 的位宽与编译器和平台有关，不适合直接用于协议字段定义。
- 浮点运算在部分 MCU 上成本较高，应结合硬件是否有 FPU 决定是否大量使用。

#### 关键字（Keywords）

关键字是语言保留字，不能作为变量名使用。

嵌入式开发最常见的一组关键字如下：

| 关键字 | 作用 | 常见场景 |
| --- | --- | --- |
| `const` | 定义只读对象 | 查表、配置参数 |
| `volatile` | 告诉编译器不要擅自优化访问 | 寄存器、中断共享变量 |
| `static` | 控制作用域和存储期 | 文件内私有函数、静态局部变量 |
| `extern` | 声明外部定义的变量或函数 | 多文件工程 |
| `typedef` | 给类型起别名 | 提高可读性 |
| `sizeof` | 计算对象或类型大小 | 缓冲区长度、数组长度 |

```c
static int s_error_count = 0;
extern int g_system_state;

typedef struct {
    uint16_t year;
    uint8_t month;
    uint8_t day;
} rtc_date_t;
```

#### 常量（Constant）

常量是在程序执行期间不应被修改的值。

常见形式：

- 字面量：`10`、`3.14`、`'A'`、`"UART"`
- 宏常量：`#define BUF_SIZE 128`
- `const` 常量：`const int timeout_ms = 1000;`
- 枚举常量：`STATE_IDLE`

```c
#define PI 3.1415926f
const int max_retry = 3;
```

宏常量和 `const` 的区别：

- `#define` 发生在预处理阶段，本质是文本替换。
- `const` 有类型，受编译器检查，更安全。

建议：

- 能用 `const` 的地方优先用 `const`。
- 宏更适合做条件编译、寄存器位定义、通用模板。

---

### 栈 和 堆（内存管理）

理解栈和堆，是写对 C 程序、避免内存错误的关键。

#### 栈 (stack)：自动分配内存，函数退出即释放

栈由编译器和 CPU 调用约定共同管理，主要用于保存函数调用现场。

典型内容：

- 局部变量
- 函数参数
- 返回地址
- 部分寄存器保存值

特征：

- 分配和释放速度快
- 生命周期明确，函数结束后自动回收
- 空间相对有限
- 不适合存放过大的局部数组

```c
void process(void) {
    int value = 10;
    char name[16] = "uart";
}
```

风险点：

- 大数组放在栈上可能导致栈溢出。
- 不能返回局部变量地址。

```c
int *bad_func(void) {
    int local = 10;
    return &local;  // 错误：返回了已经失效的地址
}
```

#### 堆 (heap)：使用 `malloc` / `free` 手动分配和释放

堆用于运行时动态申请内存，适合大小在编译时无法确定的数据。

特征：

- 生命周期由程序员控制
- 可跨函数存在
- 申请和释放速度慢于栈
- 频繁申请释放可能造成碎片

```c
#include <stdlib.h>

void example(void) {
    int *buffer = malloc(10 * sizeof(int));
    if (buffer == NULL) {
        return;
    }

    buffer[0] = 100;
    free(buffer);
    buffer = NULL;
}
```

常见函数：

- `malloc(size)`：申请指定字节数，不初始化
- `calloc(n, size)`：申请并清零
- `realloc(ptr, new_size)`：调整大小
- `free(ptr)`：释放内存

工程建议：

- 资源受限 MCU 项目中，尽量谨慎使用动态内存。
- 如果必须使用，要统一封装内存分配策略，并明确释放时机。
- `free(ptr)` 后建议把指针置为 `NULL`。

**栈 vs 堆的对比**

| 特性 | 栈（Stack） | 堆（Heap） |
| --- | --- | --- |
| 管理方式 | 自动管理 | 手动管理 |
| 生命周期 | 作用域结束自动释放 | 程序员决定 |
| 分配速度 | 快 | 相对较慢 |
| 空间大小 | 较小 | 通常更大 |
| 碎片问题 | 基本没有 | 可能出现 |
| 常见用途 | 局部变量、函数调用 | 动态缓冲区、链表、对象池 |

---

### 指针

指针是 C 语言最核心、也最容易出错的特性之一。它的本质是“保存地址的变量”。

#### 指针的基本概念

指针变量中保存的是某个对象的地址，而不是对象本身。

```c
int value = 10;
int *ptr = &value;
```

上面代码中：

- `value` 是整型变量
- `&value` 是变量 `value` 的地址
- `ptr` 是一个“指向 int 的指针”
- `*ptr` 表示访问 `ptr` 指向的内容

要点：

- `&` 取地址
- `*` 解引用
- 指针类型必须和目标对象类型匹配

#### 指针变量的定义和使用

语法：

```c
数据类型 *指针变量名;
```

示例：

```c
#include <stdio.h>

int main(void) {
    int a = 10;
    int *p = &a;

    printf("a = %d\n", a);
    printf("&a = %p\n", (void *)&a);
    printf("p = %p\n", (void *)p);
    printf("*p = %d\n", *p);

    *p = 20;
    printf("a = %d\n", a);
    return 0;
}
```

理解重点：

- `p` 存的是地址
- `*p` 才是地址对应位置上的值
- 修改 `*p` 就是在修改 `a`

#### 指针所占内存空间

指针本身也是变量，所以它也占内存。

```c
#include <stdio.h>

int main(void) {
    int *p = NULL;
    printf("%zu\n", sizeof(p));
    return 0;
}
```

常见情况：

- 32 位系统中通常是 4 字节
- 64 位系统中通常是 8 字节

注意：

- 不同类型的指针本身大小通常相同
- 但它们解引用后的对象大小不同

#### 空指针和野指针

空指针：

- 值为 `NULL`
- 表示当前不指向有效对象
- 常用作初始化值

```c
int *p = NULL;
```

野指针：

- 指向未知或已失效地址的指针
- 访问野指针通常导致崩溃或不可预期行为

常见来源：

- 指针未初始化
- 返回局部变量地址
- `free` 后继续使用

```c
int *p;
// p 未初始化，此时就是危险指针
```

#### const修饰指针

`const` 和指针结合时容易混淆，建议分三种情况记忆。

1. 指向常量的指针

```c
const int *p = &value;
```

- 可以修改 `p` 指向别处
- 不能通过 `p` 修改 `value`

2. 常量指针

```c
int *const p = &value;
```

- `p` 本身不能再指向别处
- 可以通过 `p` 修改 `value`

3. 指向常量的常量指针

```c
const int *const p = &value;
```

- 既不能改指向
- 也不能通过它改值

#### 指针和数组

数组名在多数表达式中会退化为指向首元素的指针。

```c
int arr[4] = {10, 20, 30, 40};
int *p = arr;

printf("%d\n", arr[0]);
printf("%d\n", *(p + 1));
```

理解重点：

- `arr` 代表首元素地址
- `arr[i]` 等价于 `*(arr + i)`

注意：

- `sizeof(arr)` 得到整个数组大小
- `sizeof(p)` 得到指针变量大小

#### 指针和函数

指针可以作为函数参数，也可以作为函数返回值。

1. 指针作为参数：实现“按地址传递”

```c
void swap_int(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
```

2. 指针作为返回值：常用于返回数组、动态内存或对象地址

```c
int *find_max(int *arr, int n) {
    int *max_ptr = &arr[0];
    for (int i = 1; i < n; ++i) {
        if (arr[i] > *max_ptr) {
            max_ptr = &arr[i];
        }
    }
    return max_ptr;
}
```

#### 指针数组函数

这里容易混淆三个概念：

- 指针数组：数组中每个元素都是指针
- 数组指针：指向整个数组的指针
- 函数指针：保存函数入口地址的指针

示例：

```c
int a = 1, b = 2, c = 3;
int *ptr_array[3] = {&a, &b, &c};  // 指针数组

int arr[3] = {1, 2, 3};
int (*array_ptr)[3] = &arr;        // 数组指针
```

---

### 函数指针 / 函数指针数组

函数指针保存的是函数入口地址，适合做回调、状态机、命令分发表等。

#### 指针、数组、函数

函数指针声明示例：

```c
int add(int a, int b) {
    return a + b;
}

int main(void) {
    int (*fp)(int, int) = add;
    int result = fp(3, 4);
    return result;
}
```

函数指针数组示例：

```c
int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int main(void) {
    int (*ops[2])(int, int) = {add, sub};
    int x = ops[0](10, 5);
    int y = ops[1](10, 5);
    return x + y;
}
```

嵌入式常见用途：

- 菜单命令表
- 驱动操作接口
- 中断回调表
- 状态机动作分发

---

### 表达式、语句、运算符

这三个概念经常一起出现，但含义不同。

- 表达式：会产生一个值
- 语句：完成一个动作
- 运算符：用于构造表达式

示例：

```c
a + b;        // 表达式
x = a + b;    // 赋值语句
if (x > 0) {  // 条件语句
    x--;
}
```

常见运算符分类：

| 类别 | 示例 | 用途 |
| --- | --- | --- |
| 算术运算符 | `+ - * / %` | 数值运算 |
| 关系运算符 | `> < >= <= == !=` | 比较大小和相等性 |
| 逻辑运算符 | `&& || !` | 条件组合 |
| 位运算符 | `& | ^ ~ << >>` | 寄存器与标志位操作 |
| 赋值运算符 | `= += -=` | 修改变量值 |
| 条件运算符 | `?:` | 简短条件选择 |

注意：

- `=` 是赋值，`==` 是比较
- `&&` 和 `||` 具有短路特性
- 位运算和逻辑运算不要混用

---

### 数组 / 字符串

#### 数组（Array）

数组是一组相同类型元素的连续存储空间。

```c
int adc_values[4] = {100, 200, 300, 400};
```

特点：

- 元素类型相同
- 内存连续
- 下标从 0 开始
- 越界访问不会自动报错，但后果严重

常见操作：

```c
for (int i = 0; i < 4; ++i) {
    printf("%d\n", adc_values[i]);
}
```

二维数组示例：

```c
int matrix[2][3] = {
    {1, 2, 3},
    {4, 5, 6}
};
```

#### 字符串（String）

C 语言字符串本质上是以 `'\0'` 结尾的字符数组。

```c
char name[] = "UART";
char cmd[8] = {'R', 'E', 'S', 'E', 'T', '\0'};
```

常见注意点：

- 字符串必须有结束符 `'\0'`
- 使用 `strcpy`、`sprintf` 时要注意缓冲区溢出
- 嵌入式项目中推荐优先使用带长度限制的函数，如 `snprintf`

```c
#include <stdio.h>

char buf[16];
snprintf(buf, sizeof(buf), "id=%d", 12);
```

---

### 结构体 / 共用体 / 枚举 / 位域

#### 结构体

结构体用于把多个不同类型的数据组织成一个整体。

```c
typedef struct {
    uint8_t hour;
    uint8_t minute;
    uint8_t second;
} rtc_time_t;
```

使用场景：

- 协议帧
- 设备配置
- 任务上下文
- 传感器数据打包

注意内存对齐：

- 编译器可能插入填充字节
- 设计通信协议或寄存器镜像时要特别小心

```c
typedef struct {
    uint8_t header;
    uint32_t data;
} packet_t;
```

#### 共用体

共用体（联合体）中的成员共享同一段内存。

```c
typedef union {
    uint32_t value;
    uint8_t bytes[4];
} data_u;
```

特点：

- 所有成员起始地址相同
- 同一时刻通常只使用其中一种解释方式
- 常用于协议解析、字节拆分、底层调试

#### 枚举（Enumeration）

枚举适合表示一组离散状态或命令。

```c
typedef enum {
    STATE_IDLE = 0,
    STATE_RUN,
    STATE_ERROR
} system_state_t;
```

好处：

- 提高可读性
- 降低魔法数字使用
- 适合状态机表达

#### 位域（Bit Field）

位域允许把结构体成员映射为若干个比特位。

```c
typedef struct {
    unsigned ready : 1;
    unsigned error : 1;
    unsigned mode  : 2;
    unsigned reserve : 4;
} status_flag_t;
```

注意：

- 位域布局与编译器实现有关
- 对外协议、硬件寄存器定义中通常更推荐使用掩码和位运算

---

### 位操作

位操作在嵌入式开发中非常常见，尤其是寄存器配置和状态位处理。

常见操作：

| 操作 | 写法 | 说明 |
| --- | --- | --- |
| 按位与 | `a & b` | 清零某些位 |
| 按位或 | `a | b` | 置位某些位 |
| 按位异或 | `a ^ b` | 翻转某些位 |
| 按位取反 | `~a` | 所有位取反 |
| 左移 | `a << n` | 常用于构造位掩码 |
| 右移 | `a >> n` | 提取高位或做缩放 |

示例：

```c
#define BIT(n) (1U << (n))

uint32_t reg = 0;

reg |= BIT(3);       // 置位 bit3
reg &= ~BIT(3);      // 清除 bit3
reg ^= BIT(2);       // 翻转 bit2

if (reg & BIT(0)) {
    // 检测 bit0 是否为 1
}
```

工程建议：

- 用宏统一管理位定义
- 避免直接写魔法数字，例如 `0x20`
- 位操作前确认数据类型是无符号类型，避免移位歧义

---

### 关键语义 & 修饰符

#### `const`（只读限定符）

`const` 表示对象在当前语义下不可修改。

```c
const uint16_t table_size = 128;
```

用途：

- 防止误修改
- 明确接口语义
- 提升代码可读性

#### `volatile`（防止优化）

`volatile` 告诉编译器：该变量的值可能在程序控制之外发生变化，每次访问都必须真正读写内存。

```c
volatile uint32_t *uart_sr = (uint32_t *)0x40011000;
volatile int g_flag = 0;
```

常见场景：

- 外设寄存器
- 中断与主循环共享变量
- 多线程共享的状态位

注意：

- `volatile` 不能代替锁，也不能保证原子性

#### `static`（静态变量/内部链接）

`static` 有两类常见用法：

1. 修饰局部变量：只初始化一次，生命周期延长到整个程序运行期
2. 修饰全局变量/函数：仅在当前文件内可见

```c
static int calc_crc(uint8_t *buf, int len);
```

#### `extern`（外部变量声明）

用于声明变量或函数定义在别处。

```c
extern uint8_t g_uart_rx_buf[128];
```

#### `register`（提示变量存放寄存器）

历史上用于提示编译器尽量把变量放入寄存器，现在基本由优化器自行决定，现代代码中很少使用。

#### `auto`（默认局部变量）

在 C 语言中，普通局部变量默认就是 `auto`，因此几乎不会显式书写。

---

### 内存存储类型与生命周期

从存储角度看，变量可以分为不同区域和不同生命周期。

| 类型 | 存放位置 | 生命周期 | 典型示例 |
| --- | --- | --- | --- |
| 局部变量 | 栈 | 进入作用域到离开作用域 | 函数内临时变量 |
| 静态变量 | 数据段/BSS | 程序整个运行期 | `static int count;` |
| 全局变量 | 数据段/BSS | 程序整个运行期 | `int g_flag;` |
| 动态内存 | 堆 | 手动申请到手动释放 | `malloc` 返回值 |
| 字符串常量 | 常量区 | 程序整个运行期 | `"hello"` |

理解这个表，能帮助你回答很多问题：

- 为什么局部变量地址不能返回
- 为什么 `static` 局部变量函数退出后还存在
- 为什么 `malloc` 的内存不 `free` 会泄漏

---

### 编译与调试基础

#### C 编译四阶段（以 GCC 为例）

一个 C 文件通常经历以下阶段：

1. 预处理：展开头文件、宏、条件编译
2. 编译：把 C 代码翻译为汇编
3. 汇编：把汇编翻译为目标文件
4. 链接：把多个目标文件和库文件合并成可执行文件

```bash
gcc -E main.c -o main.i
gcc -S main.c -o main.s
gcc -c main.c -o main.o
gcc main.o -o app
```

#### Makefile 示例

```makefile
CC = gcc
CFLAGS = -Wall -Wextra -O2
TARGET = app
OBJS = main.o uart.o

$(TARGET): $(OBJS)
	$(CC) $(OBJS) -o $(TARGET)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)
```

#### GCC 编译参数

常见选项：

- `-Wall -Wextra`：开启更多警告
- `-O0/-O2/-Os`：优化等级
- `-g`：生成调试信息
- `-I`：头文件路径
- `-D`：定义宏
- `-c`：只编译不链接

嵌入式场景下常见组合：

```bash
arm-none-eabi-gcc -mcpu=cortex-m4 -mthumb -O2 -g -Wall -ffunction-sections -fdata-sections
```

#### GDB 基础调试

常用命令：

```gdb
break main
run
next
step
print variable
backtrace
continue
```

建议掌握：

- 断点设置与删除
- 单步执行
- 变量查看
- 调用栈分析
- 内存查看

#### 内联汇编

当需要直接访问特殊指令或做极致性能优化时，可以使用内联汇编。

```c
__asm volatile ("nop");
```

注意：

- 仅在确有必要时使用
- 需要结合目标架构手册理解
- 可读性差，移植性较低

---

## 排序算法

排序算法在嵌入式场景中常用于：

- 采样值排序
- 中值滤波
- 优先级整理
- 小规模数据处理

### 冒泡排序（Bubble Sort）

#### 原理：

相邻元素两两比较，把较大的元素逐步“冒泡”到末尾。

#### 时间复杂度：

- 平均：`O(n^2)`
- 最好：`O(n)`（带提前结束优化）

#### 适用场景：

数据量很小、实现要求简单、教学和验证用例。

#### 示例代码：

```c
void bubble_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; ++i) {
        int swapped = 0;
        for (int j = 0; j < n - i - 1; ++j) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        if (!swapped) {
            break;
        }
    }
}
```

### 选择排序（Selection Sort）

#### 原理：

每轮选择未排序区间中的最小值，放到当前起始位置。

#### 时间复杂度：

- 平均/最坏/最好：`O(n^2)`

#### 适用场景：

交换次数要求少、数据量小、实现简单的场景。

#### 示例代码：

```c
void selection_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; ++i) {
        int min_index = i;
        for (int j = i + 1; j < n; ++j) {
            if (arr[j] < arr[min_index]) {
                min_index = j;
            }
        }
        if (min_index != i) {
            int temp = arr[i];
            arr[i] = arr[min_index];
            arr[min_index] = temp;
        }
    }
}
```

### 插入排序（Insertion Sort）

#### 原理：

把当前元素插入到前面已经有序的区间中。

#### 时间复杂度：

- 平均/最坏：`O(n^2)`
- 最好：`O(n)`

#### 适用场景：

数据量小或数据基本有序时效果较好。

#### 示例代码：

```c
void insertion_sort(int arr[], int n) {
    for (int i = 1; i < n; ++i) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

### 快速排序（Quick Sort）

#### 原理：

选一个基准值，把数组划分为左右两个区间，再递归排序。

#### 时间复杂度：

- 平均：`O(n log n)`
- 最坏：`O(n^2)`

#### 适用场景：

一般性能较好，适合较大规模数据；但在栈空间有限的 MCU 上需要注意递归深度。

#### 示例代码：

```c
int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; ++j) {
        if (arr[j] < pivot) {
            ++i;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}

void quick_sort(int arr[], int low, int high) {
    if (low < high) {
        int p = partition(arr, low, high);
        quick_sort(arr, low, p - 1);
        quick_sort(arr, p + 1, high);
    }
}
```

### 归并排序（Merge Sort）

#### 原理：

采用分治法，先拆分，再合并两个有序区间。

#### 时间复杂度：

- 平均/最坏/最好：`O(n log n)`

#### 适用场景：

需要稳定排序时较合适，但会额外占用内存。

#### 示例代码：

```c
void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    int L[n1];
    int R[n2];

    for (int i = 0; i < n1; ++i) {
        L[i] = arr[left + i];
    }
    for (int j = 0; j < n2; ++j) {
        R[j] = arr[mid + 1 + j];
    }

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }

    while (i < n1) {
        arr[k++] = L[i++];
    }
    while (j < n2) {
        arr[k++] = R[j++];
    }
}

void merge_sort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        merge_sort(arr, left, mid);
        merge_sort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}
```

### 堆排序（Heap Sort）

#### 原理：

先构建大根堆，再不断把堆顶元素交换到数组末尾。

#### 时间复杂度：

- 平均/最坏/最好：`O(n log n)`

#### 适用场景：

需要较稳定的最坏时间复杂度，同时不希望额外申请大块内存。

#### 示例代码：

```c
void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}

void heap_sort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; --i) {
        heapify(arr, n, i);
    }

    for (int i = n - 1; i > 0; --i) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}
```

---

## 总结对比表

| 排序算法 | 平均时间复杂度 | 空间复杂度 | 稳定性 | 适合场景 |
| --- | --- | --- | --- | --- |
| 冒泡排序 | `O(n^2)` | `O(1)` | 是 | 很小规模数据、教学演示 |
| 选择排序 | `O(n^2)` | `O(1)` | 否 | 希望减少交换次数 |
| 插入排序 | `O(n^2)` | `O(1)` | 是 | 数据基本有序、小规模数组 |
| 快速排序 | `O(n log n)` | `O(log n)` | 否 | 大多数通用高性能场景 |
| 归并排序 | `O(n log n)` | `O(n)` | 是 | 稳定排序要求高 |
| 堆排序 | `O(n log n)` | `O(1)` | 否 | 内存受限且需控制最坏复杂度 |

本章建议重点掌握以下内容：

- 变量、作用域、类型和生命周期的关系
- 栈、堆、指针、数组之间的内存模型
- `const`、`volatile`、`static`、`extern` 的工程语义
- 位操作、结构体和固定宽度类型在嵌入式中的实际用途
- 编译、链接、调试的基本流程

如果这一章掌握扎实，后续学习寄存器、驱动、中断、RTOS 和 Linux 内核时会顺畅很多。
