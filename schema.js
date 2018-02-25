const fs = require('fs-extra')
const _ = require('lodash')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
} = require('graphql')

const animalTypes = {
  CAT: { value: 0 },
  DOG: { value: 1 },
}

const orderByTypes = {
  count_asc: { value: 0 },
  count_desc: { value: 1 },
  alpha: { value: 3 }
}


async function getPetNames({year, animal}) {
  try {
    return await fs.readJson(`./data/json/${year}-${animal}.json`)
  } catch (err) {
    console.error(err)
  }
}

const AnimalType = new GraphQLEnumType({
  name: 'Animal',
  values: animalTypes,
});

const OrderByType = new GraphQLEnumType({
  name: 'OrderBy',
  values: orderByTypes,
});

const PetType = new GraphQLObjectType({
  name: "Pet",
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    animal: { type: AnimalType },
    year: { type: GraphQLString },
    location: { type: GraphQLString },
    count: { type: GraphQLInt },
  }
}); 

const Pets = new GraphQLObjectType({
  name: "Pets",
  fields: () => ({
    pets: { 
      type: new GraphQLList(PetType),
      args: {
        id: { type: GraphQLInt },
        year: { type: GraphQLString },
        location: { type: GraphQLString },
        animal: { type: AnimalType },
        orderBy: {type: OrderByType},
      },
      resolve: async (root, args) => {
        let response = await getPetNames(args)
        if (args.orderBy && args.orderBy === 1) {
          return _.sortBy(response, ['count'])
        }
        return response
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: Pets
});