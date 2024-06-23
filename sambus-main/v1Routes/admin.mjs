import express from 'express';
import { errorCodes } from '../core.mjs';
import { userModel } from '../schema/userSchema.mjs';
import { busModel } from '../schema/busSchema.mjs';
import { routeModel } from '../schema/routeSchema.mjs';
import { companyModel } from '../schema/companySchema.mjs';
import { isValidObjectId } from 'mongoose';
import { profilePicturePattern } from '../schema/schemaConstants.mjs';
const router = express.Router();

router.post('/bus', async (req, res, next) => {
    try {
        const { registrationNumber, name, totalSeats } = req?.body;
        const userId = req.user._id;
        if (!registrationNumber
            || !name
            || !totalSeats
            || !userId
        ){
            res.status(403).send({
                message: "REQUIRED_PARAMETER_MISSING",
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
            })
            return;
        }
        const user = await userModel.findOne({ _id: req.user._id, isAdmin: true });
        if (!user) {
            res.status(401).send({
                message: "UNAUTHORIZED",
                errorCode: errorCodes.UNAUTHORIZED,
            })
            return;
        }
        const foundBus = await busModel.findOne({ busNumber: registrationNumber }).lean();

        if (foundBus) {
            res.status(403).send({
                message: "BUS_ALREADY_EXISTS with this name or busNumber",
                errorCode: errorCodes.BUS_ALREADY_EXIST,
            })
            return;
        }

        await busModel.create({
            busNumber: registrationNumber,
            name: name,
            totalSeats: totalSeats,
        });

        res.send({
            message: 'Bus created Successfully',
            errorCode: errorCodes.SUCCESS,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR
        })
    }
})

router.post('/bus/:companyId', async (req, res, next) => {
    try {
        const companyId = req.params.companyId;
        const { registrationNumber, name, totalSeats } = req?.body;
        const userId = req.user._id;
        if (!registrationNumber
            || !name
            || !totalSeats
            || !companyId
        ){
            res.status(403).send({
                message: "REQUIRED_PARAMETER_MISSING",
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
            })
            return;
        }
        const user = await userModel.findOne({ _id: userId, isAdmin: true });
        if (!user) {
            res.status(401).send({
                message: "UNAUTHORIZED",
                errorCode: errorCodes.UNAUTHORIZED,
            })
            return;
        }
        const foundBus = await busModel.findOne({ busNumber: registrationNumber }).lean();
        const company = await companyModel.findOne({_id: companyId}).lean();

        if (!company) {
            res.status(404).send({
                message: "COMPANY_NOT_FOUND",
                errorCode: errorCodes.COMPANY_NOT_FOUND,
            });
            return;
        }

        if (foundBus) {
            res.status(403).send({
                message: "BUS_ALREADY_EXISTS with this name or busNumber",
                errorCode: errorCodes.BUS_ALREADY_EXIST,
            });
            return;
        }

        await busModel.create({
            busNumber: registrationNumber,
            name: name.toUpperCase(),
            totalSeats: totalSeats,
            company: companyId
        });

        res.send({
            message: 'Bus created Successfully',
            errorCode: errorCodes.SUCCESS,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR
        })
    }
})

router.post('/company', async (req, res, next) => {
    try {
        const { name } = req?.body;
        const userId = req.user._id;
        if (!name){
            res.status(403).send({
                message: "REQUIRED_PARAMETER_MISSING",
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
            })
            return;
        }
        const user = await userModel.findOne({ _id: userId, isAdmin: true });
        if (!user) {
            res.status(401).send({
                message: "UNAUTHORIZED",
                errorCode: errorCodes.UNAUTHORIZED,
            })
            return;
        }

        const foundCompany = await companyModel.findOne({ name: new RegExp(name, 'i') }).lean();

        if (foundCompany) {
            res.status(403).send({
                message: "COMPANY_ALREADY_EXISTS with this name",
                errorCode: errorCodes.COMPANY_ALREADY_EXIST,
            })
            return;
        }

        await companyModel.create({ name: name.toUpperCase() });

        res.send({
            message: 'Company created Successfully',
            errorCode: errorCodes.SUCCESS,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR
        })
    }
})

router.get('/companies', async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findOne({ _id: userId, isAdmin: true });
        if (!user) {
            res.status(401).send({
                message: "UNAUTHORIZED",
                errorCode: errorCodes.UNAUTHORIZED,
            })
            return;
        }
        const companies = await companyModel.find({}).lean();
        res.status(200).send({
            message: 'Companies fetched Successfully',
            data: companies,
            errorCode: errorCodes.SUCCESS,
        })
    } catch (error) {
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR
        })
    }
})

router.get('/company/:companyId/buses', async (req, res, next) => {
    try {
        const companyId = req.params.companyId;
        const company = await companyModel.findOne({_id: companyId}).lean();

        if (!company) {
            res.status(404).send({
                message: "COMPANY_NOT_FOUND",
                errorCode: errorCodes.COMPANY_NOT_FOUND,
            });
            return;
        }
        const buses = await busModel.find({company: companyId}).lean();
        res.status(200).send({
            data: buses,
            message: "SUCCESS",
            errorCode: errorCodes.SUCCESS,
        })
    } catch (error) {
        res.status(500).send({
            message: "UNKNOWN_SERVER_ERROR",
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR,
        })
    }
})

router.post('/bus-route/:busId', async (req, res, next) => {
    try {
        const busId = req?.params?.busId;
        const { origin, destination, arrivalTime, departureTime, date, price } = req?.body;
        const userId = req.user._id;

        const user = await userModel.findOne({ _id: userId, isAdmin: true });
        if (!user) {
            res.status(401).send({
                message: "UNAUTHORIZED",
                errorCode: errorCodes.UNAUTHORIZED,
            })
            return;
        }
        
        // Check if all required parameters are provided
        if (!busId || !origin || !destination || !arrivalTime || !departureTime || !date || !price) {
            res.status(403).send({
                message: "REQUIRED_PARAMETER_MISSING",
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
            });
            return;
        }
        
        // Check if busId is a valid ObjectId
        if (!isValidObjectId(busId)) {
            res.status(403).send({
                errorCode: errorCodes.INVALID_BUS_ID,
                message: 'INVALID_BUS_ID',
            });
            return;
        }
        
        // Find the bus with the provided busId
        const bus = await busModel.findById(busId);
        
        // If bus does not exist, return an error
        if (!bus) {
            res.status(400).send({
                message: "BUS_NOT_EXIST",
                errorCode: errorCodes.BUS_NOT_EXIST,
            });
            return;
        }

        // Convert time strings to Date objects
        const departureDateTime = new Date(date + 'T' + departureTime + ':00');
        const arrivalDateTime = new Date(date + 'T' + arrivalTime + ':00');

        // Create a new route with the provided details
        await routeModel.create({
            origin: origin.toUpperCase(),
            destination: destination.toUpperCase(),
            departureTime: departureDateTime,
            arrivalTime: arrivalDateTime,
            totalSeats: bus.totalSeats,
            availableSeats: bus.totalSeats,
            bus: bus._id,
            date: date,
            price: price
        });

        // Send success response
        res.status(200).send({
            message: 'Bus Route created Successfully',
            errorCode: errorCodes.SUCCESS,
        });
    } catch (error) {
        // Handle any errors and send an error response
        console.log(error.message);
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR,
        });
    }
});

router.get('/bus-routes/:busId', async (req, res, next) => {
    try {
        const busId = req?.params.busId;
        const userId = req?.user._id;
        const user = await userModel.findOne({ _id: userId, isAdmin: true });
        if (!user) {
            res.status(401).send({
                message: "UNAUTHORIZED",
                errorCode: errorCodes.UNAUTHORIZED,
            });
            return;
        }

        if (!isValidObjectId(busId)) {
            res.status(403).send({
                errorCode: errorCodes.INVALID_BUS_ID,
                message: 'INVALID_BUS_ID',
            });
            return;
        }

        const routes = await routeModel.find({ bus: busId});
        res.status(200).send({
            message: 'bus routes',
            errorCode: errorCodes.SUCCESS,
            data: routes,
        });
    } catch (error) {
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR
        })
    }
})

router.put('/bus-route/:routeId', async (req, res, next) => {
  try {
    const routeId = req?.params?.routeId;
    const userId = req.user._id;
    const user = await userModel.findOne({ _id: userId, isAdmin: true });
    if (!user) {
      res.status(401).send({
        message: "UNAUTHORIZED",
        errorCode: errorCodes.UNAUTHORIZED,
      });
      return;
    }
    const route = await routeModel.findOne({ _id: routeId });
    if (!route) {
      res.status(400).send({
        message: "ROUTE_NOT_EXIST",
        errorCode: errorCodes.ROUTE_NOT_EXIST,
      });
      return;
    }
    // Check if date is provided
    if (req.body.arrivalTime || req.body.departureTime) {
      if (!req.body.date) {
        res.status(404).send({
          message: "DATE_FIELD_MISSING",
          errorCode: errorCodes.DATE_FIELD_MISSING,
        });
        return;
      }
    }
    // Update the route with the provided details
    const updateData = {};
    if (req.body.origin) updateData.origin = req.body.origin;
    if (req.body.destination) updateData.destination = req.body.destination;
    if (req.body.price) updateData.price = req.body.price;
    if (req.body.arrivalTime) {
      updateData.arrivalTime = new Date(req.body.date + 'T' + req.body.arrivalTime + ':00');
    } else if (req.body.date) {
      updateData.arrivalTime = new Date(req.body.date + 'T' + route.arrivalTime.toISOString().slice(11, 16) + ':00');
    }
    if (req.body.departureTime) {
      updateData.departureTime = new Date(req.body.date + 'T' + req.body.departureTime + ':00');
    } else if (req.body.date) {
      updateData.departureTime = new Date(req.body.date + 'T' + route.departureTime.toISOString().slice(11, 16) + ':00');
    }
    if (req.body.date) updateData.date = req.body.date;
    await routeModel.findByIdAndUpdate(route._id, updateData);
    // Send success response
    res.status(200).send({
      message: 'Bus Route updated Successfully',
      errorCode: errorCodes.SUCCESS,
    });
  } catch (error) {
    res.status(500).send({
      message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
      errorCode: errorCodes.UNKNOWN_SERVER_ERROR,
    });
  }
});

router.delete('/bus-route/:routeId', async (req, res, next) => {
    try {
        const routeId = req?.params.routeId;
        const userId = req.user._id;
        const user = await userModel.findOne({ _id: userId, isAdmin: true });
        if (!user) {
            res.status(401).send({
                message: "UNAUTHORIZED",
                errorCode: errorCodes.UNAUTHORIZED,
            })
            return;
        }
        if (!routeId) {
            res.status(403).send({
                message: "REQUIRED_PARAMETER_MISSING",
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
            })
            return;
        }
        await routeModel.findByIdAndDelete(routeId);
        res.status(200).send({
            message: "Bus Route Deleted Successfully",
            errorCode: errorCodes.SUCCESS
        })
    } catch (error) {
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR
        })
    }
})

router.put('/company/:companyId', async (req, res, next) => {
    try {
      const companyId = req?.params?.companyId;
      const { name } = req?.body;
      const userId = req.user._id;
      if (!name){
        res.status(403).send({
          message: "REQUIRED_PARAMETER_MISSING",
          errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
        })
        return;
      }
      const user = await userModel.findOne({ _id: userId, isAdmin: true });
      if (!user) {
        res.status(401).send({
          message: "UNAUTHORIZED",
          errorCode: errorCodes.UNAUTHORIZED,
        })
        return;
      }
      const foundCompany = await companyModel.findOne({ _id: companyId }).lean();
      if (!foundCompany) {
        res.status(404).send({
          message: "COMPANY_NOT_FOUND",
          errorCode: errorCodes.COMPANY_NOT_FOUND,
        })
        return;
      }
      const existingCompany = await companyModel.findOne({ name: new RegExp(name, 'i') }).lean();
    if (existingCompany && existingCompany._id.toString() !== companyId) {
      res.status(403).send({
        message: "COMPANY_ALREADY_EXISTS with this name",
        errorCode: errorCodes.COMPANY_ALREADY_EXIST,
      })
      return;
    }
    await companyModel.findByIdAndUpdate(companyId, { name: name.toUpperCase() });
    res.send({
      message: 'Company updated Successfully',
      errorCode: errorCodes.SUCCESS,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
      errorCode: errorCodes.UNKNOWN_SERVER_ERROR
    })
  }
})

router.delete('/company/:companyId', async (req, res, next) => {
    try {
        const companyId = req?.params.companyId;
        const userId = req.user._id;
        const user = await userModel.findOne({ _id: userId, isAdmin: true });
        if (!user) {
            res.status(401).send({
                message: "UNAUTHORIZED",
                errorCode: errorCodes.UNAUTHORIZED,
            })
            return;
        }
        if (!companyId || !isValidObjectId(companyId)) {
            res.status(403).send({
                message: "REQUIRED_PARAMETER_MISSING",
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
            });
            return;
        }
        const foundCompany = await companyModel.findOne({ _id: companyId }).lean();
        if (!foundCompany) {
            res.status(404).send({
                message: "COMPANY_NOT_FOUND",
                errorCode: errorCodes.COMPANY_NOT_FOUND,
            })
            return;
        }
        const buses = await busModel.find({ company: companyId }).lean();
        const busIds = buses.map(bus => bus._id);

        await routeModel.deleteMany({ bus: { $in: busIds } });

        await busModel.deleteMany({ company: companyId });

        await companyModel.findByIdAndDelete(companyId);
        res.status(200).send({
            message: "Company Deleted Successfully",
            errorCode: errorCodes.SUCCESS
        })
    } catch (error) {
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR
        })
    }
})

router.put('/bus/:busId', async (req, res, next) => {
    try {
        const busId = req.params.busId;
        const { registrationNumber, name, totalSeats } = req.body;
        const userId = req.user._id;

        // Validate busId
        if (!busId || !isValidObjectId(busId)) {
            res.status(403).send({
                message: "INVALID_BUS_ID",
                errorCode: errorCodes.INVALID_BUS_ID,
            });
            return;
        }

        // Check if the user is an admin
        const user = await userModel.findOne({ _id: userId, isAdmin: true });
        if (!user) {
            res.status(401).send({
                message: "UNAUTHORIZED",
                errorCode: errorCodes.UNAUTHORIZED,
            });
            return;
        }

        // Check if the bus exists
        const foundBus = await busModel.findById(busId);
        if (!foundBus) {
            res.status(404).send({
                message: "BUS_NOT_EXIST",
                errorCode: errorCodes.BUS_NOT_EXIST,
            });
            return;
        }

        // Update only provided fields
        if (registrationNumber) foundBus.busNumber = registrationNumber;
        if (name) foundBus.name = name;
        if (totalSeats) foundBus.totalSeats = totalSeats;

        await foundBus.save();

        res.status(200).send({
            message: 'Bus updated successfully',
            errorCode: errorCodes.SUCCESS,
        });
    } catch (error) {
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR,
        });
    }
});

router.delete('/bus/:busId', async (req, res, next) => {
    try {
        const busId = req?.params.busId;
        const userId = req.user._id;
        const user = await userModel.findOne({ _id: userId, isAdmin: true });
        if (!user) {
            res.status(401).send({
                message: "UNAUTHORIZED",
                errorCode: errorCodes.UNAUTHORIZED,
            })
            return;
        }
        if (!busId || !isValidObjectId(busId)) {
            res.status(403).send({
                message: "REQUIRED_PARAMETER_MISSING",
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
            });
            return;
        }
        const foundBus = await busModel.findOne({ _id: busId }).lean();
        if (!foundBus) {
            res.status(404).send({
                message: "BUS_NOT_EXIST",
                errorCode: errorCodes.BUS_NOT_EXIST,
            })
            return;
        }
        await routeModel.deleteMany({ bus: busId });

        await busModel.findByIdAndDelete(busId);
        res.status(200).send({
            message: "Bus Deleted Successfully",
            errorCode: errorCodes.SUCCESS
        })
    } catch (error) {
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR
        })
    }
})

export default router;
