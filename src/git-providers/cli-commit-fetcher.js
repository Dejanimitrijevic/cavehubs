async function getCommits({ path, last }) {
  // TODO cache
  const response = await fetch(
    `/api/commits?path=${encodeURIComponent(path)}&last=${last}`
  );
  const commits = await response.json();
  commits.forEach(c => (c.date = new Date(c.date)));

  return commits;
}

export default {
  getCommits
};
