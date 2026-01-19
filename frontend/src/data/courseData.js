// Course data for OS Lab learning system
export const courses = [
  {
    id: "linux-basics",
    title: "Linux Fundamentals",
    description: "Master essential Linux commands and shell basics",
    icon: "Terminal",
    color: "emerald",
    duration: "30 min",
    lessons: [
      {
        id: "basic-commands",
        title: "Basic Commands",
        description: "Learn the essential navigation commands",
        duration: "8 min",
        theory: `
# Basic Linux Commands

The Linux command line is powerful and essential for system administration. Let's start with the most fundamental commands.

## pwd - Print Working Directory
Shows your current location in the filesystem.
\`\`\`bash
$ pwd
/home/user
\`\`\`

## ls - List Directory Contents
Shows files and folders in the current directory.
\`\`\`bash
$ ls        # Simple list
$ ls -l     # Detailed list with permissions
$ ls -la    # Include hidden files
\`\`\`

## cd - Change Directory
Navigate between directories.
\`\`\`bash
$ cd /tmp        # Go to /tmp
$ cd ..          # Go up one level
$ cd ~           # Go to home directory
$ cd -           # Go to previous directory
\`\`\`
        `,
        commands: ["pwd", "ls", "ls -la", "cd"],
        challenge: "Navigate to your home directory, list all files including hidden ones, then check your current path.",
        hint: "Use cd ~, then ls -la, then pwd"
      },
      {
        id: "file-operations",
        title: "File Operations",
        description: "Create, view, and manipulate files",
        duration: "8 min",
        theory: `
# File Operations

Learn how to create, view, and manipulate files from the command line.

## Creating Files
\`\`\`bash
$ touch myfile.txt           # Create empty file
$ echo "Hello" > file.txt    # Create with content
$ echo "World" >> file.txt   # Append to file
\`\`\`

## Viewing Files
\`\`\`bash
$ cat file.txt      # Display entire file
$ head file.txt     # First 10 lines
$ tail file.txt     # Last 10 lines
$ less file.txt     # Scrollable view (q to quit)
\`\`\`

## Copying and Moving
\`\`\`bash
$ cp source.txt dest.txt     # Copy file
$ mv old.txt new.txt         # Rename/move file
$ rm file.txt                # Delete file (careful!)
\`\`\`
        `,
        commands: ["touch", "echo", "cat", "cp", "mv", "rm"],
        challenge: "Create a file called 'hello.txt' with the text 'Hello World', then display its contents.",
        hint: "Use echo 'Hello World' > hello.txt, then cat hello.txt"
      },
      {
        id: "directories",
        title: "Directory Management",
        description: "Create and organize directories",
        duration: "7 min",
        theory: `
# Directory Management

Organize your files efficiently with directories.

## Creating Directories
\`\`\`bash
$ mkdir mydir              # Create single directory
$ mkdir -p a/b/c           # Create nested directories
\`\`\`

## Removing Directories
\`\`\`bash
$ rmdir emptydir           # Remove empty directory
$ rm -r mydir              # Remove directory with contents
$ rm -rf mydir             # Force remove (be careful!)
\`\`\`

## Viewing Directory Structure
\`\`\`bash
$ tree                     # Visual tree structure
$ ls -R                    # Recursive listing
\`\`\`
        `,
        commands: ["mkdir", "mkdir -p", "rmdir", "rm -r", "tree"],
        challenge: "Create a directory structure: project/src/components, then verify it with tree or ls -R.",
        hint: "Use mkdir -p project/src/components"
      },
      {
        id: "permissions",
        title: "File Permissions",
        description: "Understand and modify file permissions",
        duration: "7 min",
        theory: `
# File Permissions

Linux uses a permission system to control file access.

## Understanding Permissions
\`\`\`
-rw-r--r-- 1 user group 1234 Jan 20 10:00 file.txt
 │││ │││ │││
 │││ │││ └── Others: read only
 │││ └───── Group: read only  
 └──────── Owner: read + write
\`\`\`

## Permission Values
- r (read) = 4
- w (write) = 2
- x (execute) = 1

## Changing Permissions
\`\`\`bash
$ chmod 755 script.sh    # rwxr-xr-x
$ chmod 644 file.txt     # rw-r--r--
$ chmod +x script.sh     # Add execute permission
\`\`\`
        `,
        commands: ["ls -l", "chmod", "chown"],
        challenge: "Create a file and change its permissions to be readable and writable by everyone (666).",
        hint: "Use touch myfile && chmod 666 myfile, then ls -l to verify"
      }
    ]
  },
  {
    id: "process-management",
    title: "Process Management",
    description: "Understand how Linux processes work",
    icon: "Cpu",
    color: "blue",
    duration: "35 min",
    lessons: [
      {
        id: "viewing-processes",
        title: "Viewing Processes",
        description: "Monitor running processes on the system",
        duration: "8 min",
        theory: `
# Viewing Processes

Every running program in Linux is a process with a unique PID.

## ps - Process Status
\`\`\`bash
$ ps            # Your processes
$ ps aux        # All processes with details
$ ps -ef        # Full format listing
\`\`\`

## Understanding ps Output
\`\`\`
USER   PID %CPU %MEM   VSZ   RSS TTY STAT TIME COMMAND
root     1  0.0  0.1  8536  4200 ?   Ss   0:01 /sbin/init
\`\`\`

## top & htop - Real-time Monitoring
\`\`\`bash
$ top           # Real-time process viewer
$ htop          # Interactive process viewer (if installed)
\`\`\`

Press 'q' to quit top/htop.
        `,
        commands: ["ps", "ps aux", "top", "htop"],
        challenge: "Use ps aux to find all running processes, then use top to see real-time updates (press q to exit).",
        hint: "Run ps aux first, then run top and press q to quit"
      },
      {
        id: "process-lifecycle",
        title: "Process Lifecycle",
        description: "Understand how processes are created",
        duration: "10 min",
        theory: `
# Process Lifecycle

Processes are created through forking and can run in background or foreground.

## Background Processes
\`\`\`bash
$ sleep 100 &        # Run in background
$ jobs               # List background jobs
$ fg %1              # Bring job 1 to foreground
$ bg %1              # Send to background
\`\`\`

## Process States
- **R** - Running
- **S** - Sleeping (waiting for event)
- **Z** - Zombie (terminated but not reaped)
- **T** - Stopped

## Ctrl Shortcuts
- Ctrl+C - Terminate foreground process
- Ctrl+Z - Suspend foreground process
        `,
        commands: ["sleep 10 &", "jobs", "fg", "bg"],
        challenge: "Start a background process with 'sleep 60 &', list jobs, then bring it to foreground.",
        hint: "Use sleep 60 &, then jobs to see it, then fg to bring it forward"
      },
      {
        id: "signals",
        title: "Signals and Kill",
        description: "Send signals to control processes",
        duration: "8 min",
        theory: `
# Signals and Kill

Signals are software interrupts sent to processes.

## Common Signals
- **SIGTERM (15)** - Polite termination request
- **SIGKILL (9)** - Force kill (cannot be caught)
- **SIGHUP (1)** - Hangup/reload config
- **SIGSTOP (19)** - Pause process
- **SIGCONT (18)** - Continue paused process

## Sending Signals
\`\`\`bash
$ kill PID           # Send SIGTERM
$ kill -9 PID        # Send SIGKILL (force)
$ kill -STOP PID     # Pause process
$ kill -CONT PID     # Resume process
$ killall name       # Kill by process name
\`\`\`
        `,
        commands: ["kill", "kill -9", "killall"],
        challenge: "Start a background sleep process, find its PID, and terminate it with kill.",
        hint: "Use sleep 100 &, then ps to find PID, then kill PID"
      },
      {
        id: "priority",
        title: "Process Priority",
        description: "Control process scheduling priority",
        duration: "9 min",
        theory: `
# Process Priority

Linux uses nice values to determine CPU scheduling priority.

## Nice Values
- Range: -20 (highest priority) to 19 (lowest priority)
- Default: 0
- Only root can set negative values

## Setting Priority
\`\`\`bash
$ nice -n 10 command         # Start with nice value 10
$ renice 5 -p PID            # Change running process
$ renice -n 10 -p PID        # Same as above
\`\`\`

## Viewing Priority
\`\`\`bash
$ ps -l                      # Shows NI column
$ top                        # Shows NI in display
\`\`\`
        `,
        commands: ["nice", "renice", "ps -l"],
        challenge: "Start a low-priority sleep process with nice -n 19, then verify with ps -l.",
        hint: "Use nice -n 19 sleep 60 &, then ps -l to see NI column"
      }
    ]
  }
];

// Helper to get course by ID
export const getCourseById = (courseId) => {
  return courses.find(c => c.id === courseId);
};

// Helper to get lesson by IDs
export const getLessonById = (courseId, lessonId) => {
  const course = getCourseById(courseId);
  if (!course) return null;
  return course.lessons.find(l => l.id === lessonId);
};

// Helper to get next lesson
export const getNextLesson = (courseId, currentLessonId) => {
  const course = getCourseById(courseId);
  if (!course) return null;
  
  const currentIndex = course.lessons.findIndex(l => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex >= course.lessons.length - 1) return null;
  
  return course.lessons[currentIndex + 1];
};
