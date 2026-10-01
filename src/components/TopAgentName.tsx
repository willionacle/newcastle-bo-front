
const TopAgentUsername = ({name}: {name: string}) => {
  return name === "master" ? import.meta.env.VITE_AGENT_TOP : (name ?? "");
}

export default TopAgentUsername;