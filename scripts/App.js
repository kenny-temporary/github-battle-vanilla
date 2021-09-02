import queryRepositoty from "./scripts/services.js";
import presit from "./scripts/presit.js";

function PopularLanguages({ languages, onUpdate, checked }) {
  return (
    <div className="text-center d-flex justify-content-center my-5">
      {languages?.map((language) => {
        return (
          <li
            className="px-4 py-2 languageItem"
            key={language}
            onClick={() => onUpdate && onUpdate(language)}
            style={{
              color: checked === language ? "rgb(187, 46, 31)" : "black",
            }}
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
    <div>
      <div className="row justify-content-around flex-warp">
        {repositoties?.map((repositoty, key) => (
          <Card key={repositoty?.id} data={repositoty} index={key + 1} />
        ))}
      </div>

      {canLoadMore && (
        <div className="text-center">
          <button
            className="btn btn-dark my-4"
            onClick={() => onNextUpdate && onNextUpdate(checked)}
          >
            下一页数据
          </button>
        </div>
      )}
    </div>
  );
}

function Card({ data, index }) {
  return (
    <div className="col col-lg-3 repositotyItemCard">
      <h3 className="text-center mt-5">#{index}</h3>
      <div className="aspectRatioImageContainer w-50">
        <img src={data?.owner?.avatar_url} className="avatar" alt="card-item" />
      </div>

      <div className="repositotyName text-center">
        <a href={data?.html_url}>{data?.name}</a>
      </div>

      <ul className="repositotyDescription mb-4 fa-ul">
        <li>
          <i className="fa-li fa fa-user orange-icon"></i>
          <a href={data?.owner?.html_url} target="_blank">
            {data?.owner?.login}
          </a>
        </li>
        <li>
          <i className="fa-li fa fa-star yellow-icon"></i>
          {data?.stargazers_count} stars
        </li>
        <li>
          <i className="fa-li fa fa-download blue-icon"></i>
          {data?.forks_count} forks
        </li>
        <li>
          <i className="fa-li fa fa-exclamation-triangle orangered-icon"></i>
          {data?.open_issues_count} open issues
        </li>
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
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState({});

  const setRepositotiesAsync = (currentLanguage, page, type) => {
    setLoading(true);

    queryRepositoty({ language: currentLanguage, page })
      .then((repositoties) => {
        setError({});
        setCanLoadMore(!repositoties.data?.incomplete_results);

        setRepositoties((previous) => {
          const results =
            type === presit.RepositoriesUpdateStatus.Init
              ? repositoties?.data?.items
              : [...previous, ...repositoties?.data?.items];
          return results;
        });
      })
      .catch((error) => {
        setRepositoties([]);
        setError(error);
        setCanLoadMore(false);
      })
      .finally(() => {
        setLoading(false);
      });
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

      {error?.errorMessage?.message && (
        <div className="d-flex align-items-center flex-column">
          <h4>Some mistakes have occurred.</h4>
          <span>{error?.errorMessage?.message}</span>
          <span> <a href={error?.errorMessage?.documentation_url}>Click here to view the document</a></span>
        </div>
      )}

      <antd.Spin spinning={loading}>
        <PopularList
          repositoties={repositoties}
          checked={checkedLanguage}
          onNextUpdate={handleNextUpdate}
          canLoadMore={canLoadMore}
        />
      </antd.Spin>
    </div>
  );
}

function start(container) {
  ReactDOM.render(<Popular />, document.getElementById(container));
}
start("root");
