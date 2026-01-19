import {
  Cpu,
  HardDrive,
  Network,
  Clock,
  FolderTree,
  Lock,
  Terminal as TerminalIcon,
  Layers,
} from "lucide-react";

const labs = [
  {
    id: "shell-basics",
    name: "Shell Basics",
    icon: TerminalIcon,
    category: "Getting Started",
  },
  {
    id: "processes",
    name: "Process Management",
    icon: Cpu,
    category: "Core Concepts",
  },
  {
    id: "filesystem",
    name: "File System",
    icon: FolderTree,
    category: "Core Concepts",
  },
  {
    id: "scheduling",
    name: "CPU Scheduling",
    icon: Clock,
    category: "Core Concepts",
  },
  {
    id: "memory",
    name: "Memory Management",
    icon: Layers,
    category: "Advanced",
  },
  {
    id: "ipc",
    name: "IPC & Signals",
    icon: Network,
    category: "Advanced",
  },
  {
    id: "permissions",
    name: "Permissions & Security",
    icon: Lock,
    category: "Advanced",
  },
  {
    id: "disk",
    name: "Disk Management",
    icon: HardDrive,
    category: "Advanced",
  },
];

function Sidebar({ activeLab, onSelectLab }) {
  const categories = [...new Set(labs.map((lab) => lab.category))];

  return (
    <aside className="lab-sidebar">
      {categories.map((category) => (
        <div key={category} style={{ marginBottom: "1.5rem" }}>
          <h3 className="lab-sidebar-title">{category}</h3>
          <ul className="lab-list">
            {labs
              .filter((lab) => lab.category === category)
              .map((lab) => {
                const Icon = lab.icon;
                return (
                  <li
                    key={lab.id}
                    className={`lab-item ${activeLab === lab.id ? "active" : ""}`}
                    onClick={() => onSelectLab(lab.id)}
                  >
                    <Icon size={18} className="lab-item-icon" />
                    <span>{lab.name}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </aside>
  );
}

export default Sidebar;
export { labs };
