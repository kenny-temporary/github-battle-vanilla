import queryRepositoty from "./scripts/services.js";
import presit from "./scripts/presit.js";

function PopularLanguages({ languages, onUpdate, checked }) {
  return (
    <div className="text-center d-flex justify-content-center my-5">
      {languages?.map((language) => {
        return (
          <li
            key={language}
            onClick={() => onUpdate && onUpdate(language)}
            style={{ color: checked === language ? "red" : "green" }}
          >
            {language}
          </li>
        );
      })}
    </div>
  );
}

function PopularList({ repositoties, onNextUpdate, checked, canLoadMore }) {
  return (
    <div style={{ color: "green" }}>
      <div className="row">
        {repositoties?.map((repositoty, key) => (
          <Card key={repositoty?.id} data={repositoty} index={key + 1} />
        ))}
      </div>
      {canLoadMore && (
        <button onClick={() => onNextUpdate && onNextUpdate(checked)}>
          下一页数据
        </button>
      )}
    </div>
  );
}

function Card({ data, index }) {
  return (
    <div className="col col-3" style={{ border: "1px solid red" }}>
      <h2>#{index}</h2>
      <div>图片占位区域</div>
      <div>
        <a href={data?.html_url}>{data?.name}</a>
      </div>
      <ul>
        <li>
          <a href={data?.owner?.html_url} target="_blank">
            {data?.owner?.login}
          </a>
        </li>
        <li>{data?.stargazers_count} stars</li>
        <li>{data?.forks_count} forks</li>
        <li>{data?.open_issues_count} open issues</li>
      </ul>
    </div>
  );
}

function Popular() {
  const [repositoties, setRepositoties] = React.useState([]);
  const [languages] = React.useState(presit.initialLanguages);
  const [canLoadMore, setCanLoadMore] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(presit.initialPage);
  const [checkedLanguage, setCheckedLanguage] = React.useState(
    presit.initialLanguages[0]
  );

  const setRepositotiesAsync = (currentLanguage, page, type) => {
    queryRepositoty({ language: currentLanguage, page }).then(
      (repositoties) => {
        setCanLoadMore(!repositoties.data?.incomplete_results);

        setRepositoties((previous) => {
          const results =
            type === presit.RepositoriesUpdateStatus.Init
              ? repositoties?.data?.items
              : [...previous, ...repositoties?.data?.items];
          return results;
        });
      }
    );
  };

  const handleNextUpdate = (language) => {
    const nextPage = currentPage + 1;
    setRepositotiesAsync(
      language,
      nextPage,
      presit.RepositoriesUpdateStatus.Add
    );
    setCurrentPage(nextPage);
  };

  React.useEffect(() => {
    setRepositotiesAsync(
      checkedLanguage,
      presit.initialPage,
      presit.RepositoriesUpdateStatus.Init
    );
  }, [checkedLanguage]);

  return (
    <div className="container d-flex flex-column">
      <PopularLanguages
        languages={languages}
        onUpdate={setCheckedLanguage}
        checked={checkedLanguage}
      />
      <PopularList
        repositoties={repositoties}
        checked={checkedLanguage}
        onNextUpdate={handleNextUpdate}
        canLoadMore={canLoadMore}
      />
    </div>
  );
}

function start(container) {
  ReactDOM.render(<Popular />, document.getElementById(container));
}
start("root");
