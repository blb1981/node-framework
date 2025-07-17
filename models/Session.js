'use strict'
const { Model } = require('sequelize')

/**
 * @extends {Model}
 */
class Session extends Model {
  /**
   * Define associations here
   * @param {object} models
   */
  static associate(models) {
    Session.belongsTo(models.User, { as: 'user', foreignKey: 'userId', onDelete: 'CASCADE' })
  }
}

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
const initSession = (sequelize, DataTypes) => {
  Session.init(
    {
      sid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      expires: {
        type: DataTypes.DATE,
      },
      data: {
        type: DataTypes.TEXT,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Session',
      tableName: 'sessions',
    }
  )
  return Session
}

module.exports = initSession
module.exports.Session = Session
