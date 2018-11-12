#!/bin/python
import sqlite3
import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

# app = Flask(__name__)


# #################################################
# # Database Setup
# #################################################

# #app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bellybutton.sqlite"
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:C:/Users/lcc25/repos/Database-resources/Top_Schools_Finder/db/schools_Austin_region.sqlite"
# db = SQLAlchemy(app)

# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(db.engine, reflect=True)

# # Save references to each table
# Schools_Metadata = Base.classes.SchoolsAustin
# Schools_Summary = Base.classes.SchoolsAustin

Schools_Metadata = sqlite3.connect("C:/Users/lcc25/repos/Database-resources/Top_Schools_Finder/db/schools_Austin_region.sqlite")

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

connection = sqlite3.connect("Schools_Metadata")
connection.row_factory = dict_factory

cursor = connection.cursor()

cursor.execute("select * from Schools_Metadata")

# fetch all or one we'll go for all.

results = cursor.fetchall()

print (results)

connection.close()