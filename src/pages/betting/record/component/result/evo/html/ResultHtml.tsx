import RecursiveTable, { JSONLike } from "./RecursiveTable";


const ResultHtml = ({ url,result }: { url: string,result?: JSONLike }) => {
  if (url === "[object Object]") return <RecursiveTable data={result}/>
  return (
    <div dangerouslySetInnerHTML={{ __html: url}} />
  );
  
};

export default ResultHtml;
