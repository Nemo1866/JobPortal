module.exports = (sequelize, DataTypes) => {
  let appliedJobs = sequelize.define(
    "appliedJob",
    {
      candidateId: {
        type: DataTypes.INTEGER,
      },
      jobsListId: {
        type: DataTypes.INTEGER,
      },
      recruiterId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      createdAt: true,
      updatedAt: false,
    }
  );
  return appliedJobs;
};
