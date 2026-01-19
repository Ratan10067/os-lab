"""
CPU Scheduling Lab Experiments
Example scripts for learning scheduling concepts
"""

PRIORITY_DEMO = '''#!/bin/bash
# Process Priority Demo
echo "=== Process Priority Demo ==="

echo "Current process priorities:"
ps -eo pid,ni,pri,comm --sort=-pri 2>/dev/null | head -15 || ps aux | head -10

echo ""
echo "Starting low priority process..."
nice -n 10 sleep 5 &
LOW_PID=$!
echo "Low priority (nice 10) PID: $LOW_PID"

echo ""
echo "Starting high priority process..."
nice -n -5 sleep 5 2>/dev/null &
HIGH_PID=$!
echo "High priority (nice -5) PID: $HIGH_PID"

echo ""
echo "Comparing priorities:"
ps -o pid,ni,pri,comm -p $LOW_PID,$HIGH_PID 2>/dev/null || ps aux | grep sleep | grep -v grep

# Cleanup
kill $LOW_PID $HIGH_PID 2>/dev/null
'''

SCHEDULING_INFO = '''#!/bin/bash
# Scheduling Information
echo "=== Scheduling Information ==="

echo "CPU Info:"
cat /proc/cpuinfo 2>/dev/null | grep -E "model name|cpu cores" | head -4 || echo "CPU info not available"

echo ""
echo "Load average:"
uptime

echo ""
echo "CPU usage by process:"
ps -eo pid,pcpu,pmem,comm --sort=-pcpu 2>/dev/null | head -10 || top -bn1 | head -15
'''

EXPERIMENTS = {
    'priority': {
        'name': 'Process Priority',
        'description': 'Understanding nice values and priority',
        'script': PRIORITY_DEMO
    },
    'info': {
        'name': 'Scheduling Info',
        'description': 'View CPU and scheduling information',
        'script': SCHEDULING_INFO
    }
}
