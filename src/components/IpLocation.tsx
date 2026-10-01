const IPLocation = ({ip}: {ip:string}) => {
  const location = JSON.parse(ip)
  return (
    <p>
      {location ? `${location?.city}, ${location?.country}` : '-'}
    </p>
  );
};

export default IPLocation;
